# Profile data for roles without Window Access (ETP-5523)

How Etendo Mobile should read the session data shown in the user profile
(role, organization, client and warehouse), on the frontend and the backend.

## Problem

A user whose role has **User Level = Organization** and no Window, Form or
Process Access opened the profile and the app logged them out.

The profile read each value with the generic SWS REST endpoint:

```
GET /sws/com.smf.securewebservices.obRest/ADRole?q=id=='<roleId>'
GET /sws/com.smf.securewebservices.obRest/Organization?q=id=='<orgId>'
GET /sws/com.smf.securewebservices.obRest/ADClient?q=id=='<clientId>'
GET /sws/com.smf.securewebservices.obRest/Warehouse?q=id=='<warehouseId>'
```

That endpoint applies the role's entity access. A role without Window Access
has no readable entity (and `AD_Role` / `AD_Client` are System/Client level
tables), so every call returns `401 Entity ADRole is not readable by the user …`.
`useEtrest` called `logout()` on any error, so a data error ended the session.

## Current behavior (hotfix)

Only the error handling is fixed; no backend change is required.

- When a profile request fails with `401`/`403` (the role cannot read the
  data), the profile shows one toast, *"No access to this data. Check the role
  on the server."* (`RoleWithoutAccess` in `src/lang/*.json`), and then logs
  the user out, so the role can be fixed on the server.
- Any other error (network, `500`, …) does not log the user out: the field
  shows `*`.
- Settings no longer queries the role name: it never displayed it, and for
  these roles the request only produced a `401`.

## Target design

The profile shows the **caller's own session**, not business data. It must not
depend on the role's entity access. This is how the classic UI already works:
its profile widget (`UserInfoComponent`) is built on the server from `OBContext`
(e.g. `OBContext.getRole().getClient().getIdentifier()`), so it shows role,
client, organization and warehouse for any role.

### Backend: `SessionInfo` webservice in `com.smf.mobile.utils`

A new webservice that returns the ids and names of the token session.

```
GET /sws/com.smf.mobile.utils.SessionInfo
Authorization: Bearer <SWS token>
```

```json
{
  "clientId": "23C5…",       "clientName": "F&B International Group",
  "roleId": "E1F9…",         "roleName": "Warehouse Operations",
  "organizationId": "E443…", "organizationName": "F&B España - Región Norte",
  "warehouseId": "B2D4…",    "warehouseName": "España Región Norte",
  "userId": "7189…",         "userName": "operator"
}
```

- `401` without a valid token (handled by SWS, unchanged).
- Names are read in admin mode, from `OBContext`, only for the caller's session.
- It does not change any existing service or permission.

Implementation: a class implementing `org.openbravo.service.web.WebService`
(same pattern as `com.smf.mobile.utils.webservices.Version`), registered as a
bean in `config/com.smf.mobile.utils-provider-config.xml`:

```xml
<bean>
  <name>SessionInfo</name>
  <class>com.smf.mobile.utils.webservices.SessionInfo</class>
  <singleton>true</singleton>
</bean>
```

```java
public void doGet(String path, HttpServletRequest request, HttpServletResponse response) {
  OBContext.setAdminMode(true);
  try {
    OBContext context = OBContext.getOBContext();
    put(json, "client", context.getCurrentClient());          // clientId, clientName
    put(json, "role", context.getRole());
    put(json, "organization", context.getCurrentOrganization());
    put(json, "warehouse", context.getWarehouse());
    put(json, "user", context.getUser());
  } finally {
    OBContext.restorePreviousMode();
  }
  // write json (application/json, utf-8)
}
```

**Why `com.smf.mobile.utils`**

| Module | Present in every environment | Used only by mobile | Notes |
|---|---|---|---|
| `com.smf.mobile.utils` | Yes, it ships in `etendo_core/modules_core` | Yes | The app already calls it on every login (`Version`) |
| `com.etendoerp.dynamic.app` | No, optional module (Platform Extensions) | Yes | Missing in some environments |
| `com.etendoerp.mobile.extensions` | No (e.g. Guaguas does not install it) | Yes | Bundle, not a module |
| `com.smf.securewebservices` | Yes | No, used by many projects | Avoid changes |

The same pattern (module-owned webservice, admin mode, session from
`OBContext`) is already used by sub-apps such as
`com.etendoerp.guaguas.subapp.pending.orders` (`MaterialReceiptWebService`).

### Frontend: name resolution in `hook/useEtrest.ts`

Each name is resolved from the first source that has it:

1. **`SessionInfo`**: one request per session (cached), gives all four names.
   A value is used only if its id matches the session data (`data.roleId`,
   `data.organization`, `data.client`, `data.warehouseId`).
2. **SWS login with the session token** (`POST /sws/login`, body `{}`), for
   backends without `SessionInfo`. Its `roleList` has role, organization and
   warehouse names, but no client. The new token it returns is ignored.
3. **The entity query** (`obRest`), which needs read access.

If all sources fail, the field shows `*`; if the failure is `401`/`403`, the
`RoleWithoutAccess` toast is shown once and the user is logged out (same as
the current hotfix).

| Backend | Role with access | Role without Window Access |
|---|---|---|
| With `SessionInfo` | 4 names | 4 names |
| Without `SessionInfo` | 4 names | Role, organization, warehouse; client `*` + toast |
| Before this design | 4 names | Toast + logout (current hotfix) |

### Tests

- Backend: `SessionInfoTest` (mocked `OBContext`): names returned in admin
  mode; a session without warehouse returns `null`.
- Frontend: `useEtrest` tests for each source and fallback, id mismatch and
  error propagation; `Profile` test for the single toast.

## Alternatives considered

| Option | Why not |
|---|---|
| Relax `obRest` permissions for the session's own records | Security change in the generic endpoint used by every SWS client |
| Add `clientName` to the `/sws/login` `roleList` | Small and additive, but touches SWS and uses an authentication endpoint as a data source |
| Read the client from the token | The token only carries ids |
| Read `ADUser.defaultClient` | `ADUser` is also denied (`401`) for these roles |
| OpenAPI `neo` endpoints (`/sws/neo/user/user/{id}`) | Also role-gated (`403`); part of EtendoGo, not standard |

## Related work

- Mobile: branch `feature/ETP-5523-session-info` (local) has the frontend
  resolution above.
- Core: branch `hotfix/ETP-5523` in `etendo_core` (local, commit `07a1543b`)
  has `SessionInfo` and its test.
- SWS issue found while investigating, to be reported separately:
  `SecureDataToJson` leaves admin mode unbalanced when `checkReadable` fails
  ("Unbalanced calls to setAdminMode and restorePreviousMode"), and
  `BaseSecureWebServiceServlet` returns `401` without logging the cause.
