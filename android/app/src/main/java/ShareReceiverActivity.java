package com.smf.mobile.etendo_app_loader;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
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

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class ShareReceiverActivity extends AppCompatActivity {

  private static final String SHARED_PREFS_NAME = "group.com.etendoapploader.ios";
  private static final String TAG = "ShareReceiverActivity";

  private String token;
  private String urlToFetchSubApps;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    if (!loadSharedPreferences()) {
      showErrorAndFinish("Please log in to the main application before using this feature.");
      return;
    }

    try {
      handleIncomingShare();
    } catch (Exception e) {
      Log.e(TAG, "Error processing the shared content", e);
      showErrorAndFinish("Error processing the shared content.");
    }
  }

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

  private void handleIncomingShare() throws Exception {
    Intent intent = getIntent();
    if (intent == null) {
      showErrorAndFinish("Invalid share intent.");
      return;
    }

    String action = intent.getAction();
    String type = intent.getType();

    if (Intent.ACTION_SEND.equals(action)) {
      handleSingleFile(intent, type);
    } else if (Intent.ACTION_SEND_MULTIPLE.equals(action)) {
      handleMultipleFiles(intent, type);
    } else {
      showErrorAndFinish("Unsupported share action.");
    }
  }

  private void handleSingleFile(Intent intent, String mimeType) throws Exception {
    Uri fileUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
    if (fileUri != null) {
      processFile(fileUri, mimeType);
    } else {
      showErrorAndFinish("No file found in the shared content.");
    }
  }

  private void handleMultipleFiles(Intent intent, String mimeType) throws Exception {
    ArrayList<Uri> fileUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
    if (fileUris != null && !fileUris.isEmpty()) {
      processFile(fileUris.get(0), mimeType);
    } else {
      showErrorAndFinish("No files found in the shared content.");
    }
  }

  private void processFile(Uri uri, String mimeType) throws Exception {
    String fileName = getFileName(uri);

    File sharedFile = new File(getFilesDir(), fileName);
    try (InputStream inputStream = getContentResolver().openInputStream(uri);
        FileOutputStream outputStream = new FileOutputStream(sharedFile)) {

      byte[] buffer = new byte[1024];
      int read;
      while ((read = inputStream.read(buffer)) != -1) {
        outputStream.write(buffer, 0, read);
      }

      saveFileInfo(sharedFile.getAbsolutePath(), fileName, mimeType);
      fetchSubApplications();
    }
  }

  private String getFileName(Uri uri) {
    if (TextUtils.equals(uri.getScheme(), "content")) {
      try (Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
        if (cursor != null && cursor.moveToFirst()) {
          return cursor.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
        }
      }
    }
    return uri.getLastPathSegment();
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
        runOnUiThread(() -> showErrorAndFinish("Failed to retrieve sub-applications."));
      }

      @Override
      public void onResponse(Call call, Response response) throws IOException {
        if (!response.isSuccessful()) {
          Log.e(TAG, "Request failed. Status code: " + response.code());
          runOnUiThread(() -> showErrorAndFinish("Error fetching sub-applications."));
          return;
        }

        try {
          JSONArray subAppsArray = new JSONArray(response.body().string());
          runOnUiThread(() -> showShareModal(subAppsArray));
        } catch (JSONException e) {
          Log.e(TAG, "Error parsing server response", e);
          runOnUiThread(() -> showErrorAndFinish("Error parsing server response."));
        }
      }
    });
  }

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

    new AlertDialog.Builder(this)
        .setTitle("Select a sub-application")
        .setItems(appNames.toArray(new String[0]), (dialog, which) -> handleShare(subApps.get(which)))
        .setNegativeButton("Cancel", (dialog, which) -> finish())
        .show();
  }

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
      showErrorAndFinish("Error handling selected sub-application.");
    }
  }

  private void startMainActivity() {
    Intent intent = new Intent(this, MainActivity.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
    startActivity(intent);
    finish();
  }

  private void showErrorAndFinish(String message) {
    Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    finish();
  }
}