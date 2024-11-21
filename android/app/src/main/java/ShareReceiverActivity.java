package com.smf.mobile.etendo_app_loader;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.SharedPreferences;

import java.io.File;
import java.io.InputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import java.util.ArrayList;
import java.util.List;

import android.database.Cursor;
import android.provider.OpenableColumns;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import okhttp3.*;

public class ShareReceiverActivity extends AppCompatActivity {

  private static final String SHARED_PREFS_NAME = "group.com.etendoapploader.ios";
  private static final String TAG = "ShareReceiverActivity";

  private String token;
  private String urlToFetchSubApps;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    try {
      SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
      token = sharedPreferences.getString("token", null);
      urlToFetchSubApps = sharedPreferences.getString("urlToFetchSubApps", null);

      if (token != null && urlToFetchSubApps != null) {
        handleIncomingShare();
      } else {
        showErrorAndFinish("Please log in to the main application before using this feature.");
      }

    } catch (Exception e) {
      showErrorAndFinish("Error processing the shared content.");
    }
  }

  private void handleIncomingShare() throws Exception {
    Intent intent = getIntent();
    if (intent == null) {
      showErrorAndFinish("Could not retrieve the Intent.");
      return;
    }

    String action = intent.getAction();
    String type = intent.getType();

    if (action == null || type == null) {
      showErrorAndFinish("The Intent does not contain a valid action or type.");
      return;
    }

    if (Intent.ACTION_SEND.equals(action)) {
      Uri fileUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
      if (fileUri != null) {
        processFile(fileUri, type);
      } else {
        showErrorAndFinish("Could not retrieve the shared file.");
      }
    } else if (Intent.ACTION_SEND_MULTIPLE.equals(action)) {
      ArrayList<Uri> fileUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
      if (fileUris != null && !fileUris.isEmpty()) {
        processFile(fileUris.get(0), type);
      } else {
        showErrorAndFinish("Could not retrieve the shared files.");
      }
    } else {
      showErrorAndFinish("Unsupported action type.");
    }
  }

  private void processFile(Uri uri, String mimeType) throws Exception {
    String fileName = getFileName(uri);

    InputStream inputStream = getContentResolver().openInputStream(uri);
    File sharedFile = new File(getFilesDir(), fileName);

    FileOutputStream outputStream = new FileOutputStream(sharedFile);
    byte[] buffer = new byte[1024];
    int read;
    while ((read = inputStream.read(buffer)) != -1) {
      outputStream.write(buffer, 0, read);
    }
    outputStream.flush();
    outputStream.close();
    inputStream.close();

    saveFileInfo(sharedFile.getAbsolutePath(), fileName, mimeType);

    fetchSubApplications();
  }

  private String getFileName(Uri uri) {
    String result = null;
    if (uri.getScheme().equals("content")) {
      Cursor cursor = getContentResolver().query(uri, null, null, null, null);
      try {
        if (cursor != null && cursor.moveToFirst()) {
          int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
          result = cursor.getString(nameIndex);
        }
      } finally {
        cursor.close();
      }
    }
    if (result == null) {
      result = uri.getLastPathSegment();
    }
    return result;
  }

  private void saveFileInfo(String filePath, String fileName, String mimeType) {
    SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putString("sharedFilePath", filePath);
    editor.putString("sharedFileName", fileName);
    editor.putString("sharedFileMimeType", mimeType);
    editor.apply();
  }

  private void fetchSubApplications() {
    String urlStringWithPath = urlToFetchSubApps + "/sws/com.etendoerp.dynamic.app.userApp";

    OkHttpClient client = new OkHttpClient();
    Request request = new Request.Builder()
        .url(urlStringWithPath)
        .addHeader("Authorization", "Bearer " + token)
        .build();

    client.newCall(request).enqueue(new Callback() {
      @Override
      public void onFailure(Call call, IOException e) {
        runOnUiThread(() -> showErrorAndFinish("Could not retrieve the sub-applications."));
      }

      @Override
      public void onResponse(Call call, Response response) throws IOException {
        if (!response.isSuccessful()) {
          runOnUiThread(() -> showErrorAndFinish("Request error. Status code: " + response.code()));
          return;
        }

        String responseBody = response.body().string();

        try {
          JSONArray subAppsArray = new JSONArray(responseBody);
          runOnUiThread(() -> showShareModal(subAppsArray));
        } catch (JSONException e) {
          runOnUiThread(() -> showErrorAndFinish("Error parsing the server response."));
        }
      }
    });
  }

  private void showShareModal(JSONArray subAppsArray) {
    AlertDialog.Builder builder = new AlertDialog.Builder(this);
    builder.setTitle("Select a sub-application");

    List<String> appNames = new ArrayList<>();
    List<JSONObject> subApps = new ArrayList<>();

    for (int i = 0; i < subAppsArray.length(); i++) {
      try {
        JSONObject subApp = subAppsArray.getJSONObject(i);
        String appName = subApp.optString("etdappAppName", "Unknown App");
        appNames.add(appName);
        subApps.add(subApp);
      } catch (JSONException e) {
        e.printStackTrace();
      }
    }

    builder.setItems(appNames.toArray(new String[0]), (dialog, which) -> {
      JSONObject selectedSubApp = subApps.get(which);
      handleShare(selectedSubApp);
    });

    builder.setNegativeButton("Cancel", (dialog, which) -> {
      finish();
    });

    AlertDialog dialog = builder.create();
    dialog.show();
  }

  private void handleShare(JSONObject selectedSubApp) {
    try {
      String subApplication = selectedSubApp.optString("etdappAppName", "Unknown App");
      String path = selectedSubApp.optString("path", "Unknown Path");

      SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
      SharedPreferences.Editor editor = sharedPreferences.edit();
      editor.putString("selectedSubApplication", subApplication);
      editor.putString("selectedPath", path);
      editor.apply();

      startMainActivity();

    } catch (Exception e) {
      showErrorAndFinish("Error al manejar la selección.");
    }
  }

  private void startMainActivity() {
    Intent launchIntent = new Intent(this, MainActivity.class);
    launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
    launchIntent.setData(Uri.parse("com.smf.mobile.etendo://open"));
    startActivity(launchIntent);
    finish();
  }

  private void showErrorAndFinish(String message) {
    Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    finish();
  }
}
