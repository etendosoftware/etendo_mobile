package com.smf.mobile.etendo_app_loader;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class ShareReceiverActivity extends AppCompatActivity {

  private static final String SHARED_PREFS_NAME = "group.com.etendoapploader.android";
  private static final String TAG = "ShareReceiverActivity";

  private String token;
  private String urlToFetchSubApps;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Load token and URL from SharedPreferences.
    // If they are missing, show a modal with the variable values.
    if (!loadSharedPreferences()) {
      showVariablesModal();
      return;
    }

    Intent intent = getIntent();
    handleShareIntent(intent);
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    handleShareIntent(intent);
  }

  /**
   * Handles the incoming share Intent.
   */
  private void handleShareIntent(Intent intent) {
    if (intent == null) {
      Log.e(TAG, "handleShareIntent: Intent is null");
      finish();
      return;
    }

    try {
      handleIncomingShare(intent);
    } catch (Exception e) {
      Log.e(TAG, "Error processing the shared content", e);
      showErrorAndFinish("Error processing the shared content.");
    }
  }

  /**
   * Loads token and urlToFetchSubApps from SharedPreferences.
   * Returns false if either is missing.
   */
  private boolean loadSharedPreferences() {
    SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
    token = sharedPreferences.getString("token", null);
    urlToFetchSubApps = sharedPreferences.getString("urlToFetchSubApps", null);

    if (TextUtils.isEmpty(token) || TextUtils.isEmpty(urlToFetchSubApps)) {
      Log.e(TAG, "Token or URL missing in SharedPreferences");
      return false;
    }
    return true;
  }

  /**
   * Shows a modal (AlertDialog) displaying the values of the token and
   * urlToFetchSubApps.
   * This is useful for debugging when the variables are not set.
   */
  private void showVariablesModal() {
    String message = "Token: " + token + "\nURL: " + urlToFetchSubApps;
    new AlertDialog.Builder(this)
        .setTitle("Debug Variables")
        .setMessage(message)
        .setCancelable(false)
        .setPositiveButton("OK", (dialog, which) -> {
        })
        .show();
  }

  /**
   * Handles the received Intent by validating the action type (SEND vs
   * SEND_MULTIPLE).
   */
  private void handleIncomingShare(Intent intent) throws Exception {
    String action = intent.getAction();
    String type = intent.getType();

    if (action == null) {
      Log.e(TAG, "handleIncomingShare: Action is null");
      showErrorAndFinish("Share action is null.");
      return;
    }

    switch (action) {
      case Intent.ACTION_SEND:
        handleSingleFile(intent);
        break;
      case Intent.ACTION_SEND_MULTIPLE:
        handleMultipleFiles(intent);
        break;
      default:
        showErrorAndFinish("Unsupported share action: " + action);
        break;
    }
  }

  /**
   * Handles a single shared file.
   */
  private void handleSingleFile(Intent intent) throws Exception {
    Uri fileUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);

    if (fileUri != null) {
      List<Uri> uriList = new ArrayList<>();
      uriList.add(fileUri);
      processFiles(uriList);
    } else {
      showErrorAndFinish("No file found in the shared content (single).");
    }
  }

  /**
   * Handles multiple shared files.
   */
  private void handleMultipleFiles(Intent intent) throws Exception {
    ArrayList<Uri> fileUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
    Log.d(TAG, "handleMultipleFiles: File URIs = " + fileUris);

    if (fileUris != null && !fileUris.isEmpty()) {
      processFiles(fileUris);
    } else {
      showErrorAndFinish("No files found in the shared content (multiple).");
    }
  }

  /**
   * Processes a list of shared files:
   * - Clears previous selection.
   * - For each URI, processes the file and accumulates its info in a JSONArray.
   * - Saves the JSONArray in SharedPreferences under "sharedFiles".
   * - Then calls fetchSubApplications().
   */
  private void processFiles(List<Uri> uris) {
    ExecutorService executorService = Executors.newSingleThreadExecutor();
    executorService.execute(() -> {
      try {
        clearSelectionData();
        JSONArray filesArray = new JSONArray();
        for (Uri uri : uris) {
          try {
            JSONObject fileInfo = processFile(uri);
            filesArray.put(fileInfo);
          } catch (IOException e) {
            Log.e(TAG, "Error processing file " + uri, e);
          }
        }
        if (filesArray.length() > 0) {
          saveFilesInfo(filesArray.toString());
          fetchSubApplications();
        } else {
          runOnUiThread(() -> showErrorAndFinish("No files processed"));
        }
      } catch (Exception e) {
        Log.e(TAG, "Exception in processFiles", e);
      } finally {
        executorService.shutdown();
      }
    });
  }

  /**
   * Clears previous sub-application selection.
   */
  private void clearSelectionData() {
    SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.remove("selectedSubApplication");
    editor.remove("selectedPath");
    editor.apply();
    Log.d(TAG, "Previous sub-application selection cleared.");
  }

  /**
   * Processes a single file: copies it to internal storage and returns a
   * JSONObject
   * with keys "path", "name" and "mimeType".
   */
  private JSONObject processFile(Uri uri) throws IOException {
    String fileName = getFileName(uri);
    String mimeType = getContentResolver().getType(uri);
    if (mimeType == null) {
      mimeType = "application/octet-stream";
    }
    File sharedFile = new File(getFilesDir(), fileName);
    try (InputStream inputStream = getContentResolver().openInputStream(uri);
        FileOutputStream outputStream = new FileOutputStream(sharedFile)) {

      if (inputStream == null) {
        throw new IOException("Unable to open input stream for URI: " + uri.toString());
      }

      byte[] buffer = new byte[1024];
      int read;
      while ((read = inputStream.read(buffer)) != -1) {
        outputStream.write(buffer, 0, read);
      }
    }
    JSONObject fileInfo = new JSONObject();
    try {
      fileInfo.put("path", sharedFile.getAbsolutePath());
      fileInfo.put("name", fileName);
      fileInfo.put("mimeType", mimeType);
    } catch (JSONException e) {
      throw new IOException("Error creating JSON object for file info", e);
    }
    return fileInfo;
  }

  /**
   * Retrieves the file name from the given URI.
   */
  private String getFileName(Uri uri) {
    if (uri == null) {
      return "UnknownFileName";
    }
    if (TextUtils.equals(uri.getScheme(), "content")) {
      try (Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
        if (cursor != null && cursor.moveToFirst()) {
          int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
          if (nameIndex >= 0) {
            String name = cursor.getString(nameIndex);
            Log.d(TAG, "getFileName: Retrieved name via cursor = " + name);
            return name;
          }
        }
      } catch (Exception e) {
        Log.e(TAG, "Error retrieving file name from Uri", e);
      }
    }
    String lastPathSegment = uri.getLastPathSegment();
    String fallbackName = lastPathSegment != null ? lastPathSegment : "UnknownFileName";
    Log.d(TAG, "getFileName: Fallback name = " + fallbackName);
    return fallbackName;
  }

  /**
   * Saves the JSONArray (string) of shared file information in SharedPreferences
   * under "sharedFiles".
   */
  private void saveFilesInfo(String filesJson) {
    SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putString("sharedFiles", filesJson);
    editor.apply();
  }

  /**
   * Calls the sub-applications endpoint using token and urlToFetchSubApps.
   * Upon a successful response, shows a modal to select a sub-application.
   */
  private void fetchSubApplications() {
    String url = urlToFetchSubApps + "/sws/com.etendoerp.dynamic.app.userApp";

    OkHttpClient client = new OkHttpClient();
    Request request = new Request.Builder()
        .url(url)
        .addHeader("Authorization", "Bearer " + token)
        .build();

    client.newCall(request).enqueue(new Callback() {
      @Override
      public void onFailure(Call call, IOException e) {
        Log.e(TAG, "Failed to fetch sub-applications", e);
        runOnUiThread(() -> showDetailedError(
            "Failed to retrieve sub-applications.\n\n" +
                "Token: " + token + "\nURL: " + urlToFetchSubApps + "\n\nException:\n" + e.getMessage()));
      }

      @Override
      public void onResponse(Call call, Response response) throws IOException {
        if (!response.isSuccessful()) {
          String msg = "Error fetching sub-applications.\n\n" +
              "HTTP Status: " + response.code() + "\n" +
              "Token: " + token + "\nURL: " + urlToFetchSubApps;
          runOnUiThread(() -> showDetailedError(msg));
          return;
        }

        String responseBody = response.body() != null ? response.body().string() : "";

        try {
          JSONObject jsonObj = new JSONObject(responseBody);
          JSONArray subAppsArray = jsonObj.optJSONArray("data");

          if (subAppsArray == null) {
            throw new JSONException("Missing 'data' array in response.");
          }

          runOnUiThread(() -> showShareModal(subAppsArray));
        } catch (JSONException e) {
          String msg = "Error parsing server response.\n\n" +
              "Token: " + token + "\nURL: " + urlToFetchSubApps + "\n\n" +
              "Response Body:\n" + responseBody + "\n\n" +
              "Exception:\n" + e.getMessage();
          runOnUiThread(() -> showDetailedError(msg));
        }
      }
    });
  }

  /**
   * Displays an AlertDialog with detailed error information.
   */
  private void showDetailedError(String message) {
    new AlertDialog.Builder(this)
        .setTitle("An error occurred")
        .setMessage(message)
        .setCancelable(false)
        .setPositiveButton("OK", (dialog, which) -> finish())
        .show();
  }

  /**
   * Displays a dialog for selecting a sub-application from the list.
   */
  private void showShareModal(JSONArray subAppsArray) {
    List<String> appNames = new ArrayList<>();
    List<JSONObject> subApps = new ArrayList<>();

    for (int i = 0; i < subAppsArray.length(); i++) {
      try {
        JSONObject subApp = subAppsArray.getJSONObject(i);
        appNames.add(subApp.optString("etdappAppName", "Unknown App"));
        subApps.add(subApp);
      } catch (JSONException e) {
        Log.e(TAG, "Error reading sub-application data", e);
      }
    }

    if (appNames.isEmpty()) {
      showDetailedError("No sub-applications available.");
      return;
    }
    new AlertDialog.Builder(this)
        .setTitle("Select a sub-application")
        .setItems(appNames.toArray(new String[0]), (dialog, which) -> {
          JSONObject selectedSubApp = subApps.get(which);
          showConfirmationModal(selectedSubApp);
        })
        .setNegativeButton("Cancel", (dialog, which) -> finish())
        .setCancelable(false)
        .show();
  }

  /**
   * Displays a confirmation modal showing the token and selected sub-application
   * details.
   */
  private void showConfirmationModal(JSONObject selectedSubApp) {
    String subAppName = selectedSubApp.optString("etdappAppName", "Unknown App");
    String subAppPath = selectedSubApp.optString("path", "Unknown Path");
    String message = "Token: " + token + "\n\n" +
        "Sub-Application Details:\n" +
        "Name: " + subAppName + "\n" +
        "Path: " + subAppPath;

    new AlertDialog.Builder(this)
        .setTitle("Confirm Sub-Application")
        .setMessage(message)
        .setCancelable(false)
        .setPositiveButton("Continue", (dialog, which) -> handleShare(selectedSubApp))
        .setNegativeButton("Cancel", (dialog, which) -> finish())
        .show();
  }

  /**
   * Handles the selected sub-application by saving its information.
   */
  private void handleShare(JSONObject selectedSubApp) {
    try {
      SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
      SharedPreferences.Editor editor = sharedPreferences.edit();
      editor.putString("selectedSubApplication", selectedSubApp.optString("etdappAppName", "Unknown App"));
      editor.putString("selectedPath", selectedSubApp.optString("path", "Unknown Path"));
      editor.apply();
      startMainActivity();
    } catch (Exception e) {
      Log.e(TAG, "Error handling selected sub-application", e);
      showDetailedError("Error handling selected sub-application.");
    }
  }

  /**
   * Launches MainActivity and finishes this activity.
   */
  private void startMainActivity() {
    Intent intent = new Intent(this, MainActivity.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
    startActivity(intent);
    finish();
  }

  /**
   * Displays a Toast message and finishes the Activity.
   */
  private void showErrorAndFinish(String errorMessage) {
    new AlertDialog.Builder(this)
        .setTitle("Error")
        .setMessage(errorMessage)
        .setCancelable(false)
        .setPositiveButton("OK", (dialog, which) -> finish())
        .show();
  }
}
