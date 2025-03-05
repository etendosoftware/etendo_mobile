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

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Activity that handles receiving and processing shared content from other apps,
 * allowing users to select a sub-application to handle the shared files.
 */
public class ShareReceiverActivity extends AppCompatActivity {
    private static final String SHARED_PREFS_NAME = "group.com.etendoapploader.android";
    private static final String TAG = "ShareReceiverActivity";
    private static final String SUB_APPS_ENDPOINT = "/sws/com.etendoerp.dynamic.app.userApp";

    private SharedPreferences sharedPreferences;
    private String token;
    private String baseUrl;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private final OkHttpClient httpClient = new OkHttpClient();

    /**
     * Called when the activity is first created.
     * @param savedInstanceState If the activity is being re-initialized after previously being shut down
     *                           then this Bundle contains the data it most recently supplied
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, MODE_PRIVATE);
        
        if (!initializeConfig()) {
            showErrorAndFinish("Configuration missing. Please set up the app first.");
            return;
        }
        
        handleIntent(getIntent());
    }

    /**
     * Called when a new intent is received while the activity is running.
     * @param intent The new Intent that was received
     */
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }

    /**
     * Called when the activity is being destroyed.
     * Ensures proper cleanup of resources.
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (!executorService.isShutdown()) {
            executorService.shutdown();
        }
    }

    /**
     * Initializes configuration by loading token and base URL from SharedPreferences.
     * @return true if configuration is valid, false otherwise
     */
    private boolean initializeConfig() {
        token = sharedPreferences.getString("token", null);
        baseUrl = sharedPreferences.getString("urlToFetchSubApps", null);
        return !TextUtils.isEmpty(token) && !TextUtils.isEmpty(baseUrl);
    }

    /**
     * Processes the incoming intent to determine the type of share action.
     * @param intent The intent received from another app
     */
    private void handleIntent(Intent intent) {
        if (intent == null || intent.getAction() == null) {
            showErrorAndFinish("Invalid share request");
            return;
        }

        switch (intent.getAction()) {
            case Intent.ACTION_SEND:
                handleSingleShare(intent);
                break;
            case Intent.ACTION_SEND_MULTIPLE:
                handleMultipleShare(intent);
                break;
            default:
                showErrorAndFinish("Unsupported share action");
        }
    }

    /**
     * Handles a single file share intent.
     * @param intent The intent containing a single file URI
     */
    private void handleSingleShare(Intent intent) {
        Uri fileUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        if (fileUri != null) {
            processFiles(List.of(fileUri));
        } else {
            showErrorAndFinish("No file found to share");
        }
    }

    /**
     * Handles a multiple files share intent.
     * @param intent The intent containing multiple file URIs
     */
    private void handleMultipleShare(Intent intent) {
        ArrayList<Uri> fileUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
        if (fileUris != null && !fileUris.isEmpty()) {
            processFiles(fileUris);
        } else {
            showErrorAndFinish("No files found to share");
        }
    }

    /**
     * Processes a list of file URIs in a background thread.
     * @param uris List of file URIs to process
     */
    private void processFiles(List<Uri> uris) {
        executorService.execute(() -> {
            try {
                clearPreviousSelection();
                JSONArray filesArray = processFileUris(uris);
                
                if (filesArray.length() > 0) {
                    saveFilesInfo(filesArray);
                    fetchSubApplications();
                } else {
                    runOnUiThread(() -> showErrorAndFinish("No valid files processed"));
                }
            } catch (Exception e) {
                Log.e(TAG, "Error processing files", e);
                runOnUiThread(() -> showErrorAndFinish("Error processing files"));
            }
        });
    }

    /**
     * Processes a list of URIs into a JSONArray of file information.
     * @param uris List of file URIs to process
     * @return JSONArray containing file information
     * @throws IOException if file processing fails
     */
    private JSONArray processFileUris(List<Uri> uris) throws IOException {
        JSONArray filesArray = new JSONArray();
        for (Uri uri : uris) {
            try {
                JSONObject fileInfo = processSingleFile(uri);
                filesArray.put(fileInfo);
            } catch (Exception e) {
                Log.w(TAG, "Failed to process file: " + uri, e);
            }
        }
        return filesArray;
    }

    /**
     * Processes a single file URI into a JSONObject with file information.
     * @param uri The URI of the file to process
     * @return JSONObject containing file path, name, and MIME type
     * @throws IOException if file processing fails
     */
    private JSONObject processSingleFile(Uri uri) throws IOException {
        String fileName = getFileNameFromUri(uri);
        String mimeType = getContentResolver().getType(uri) != null 
            ? getContentResolver().getType(uri) 
            : "application/octet-stream";
        
        File outputFile = new File(getFilesDir(), fileName);
        copyFileToStorage(uri, outputFile);

        JSONObject fileInfo = new JSONObject();
        try {
            fileInfo.put("path", outputFile.getAbsolutePath());
            fileInfo.put("name", fileName);
            fileInfo.put("mimeType", mimeType);
            return fileInfo;
        } catch (Exception e) {
            throw new IOException("Failed to create file info", e);
        }
    }

    /**
     * Copies a file from a URI to internal storage.
     * @param sourceUri The source file URI
     * @param targetFile The target file location
     * @throws IOException if file copying fails
     */
    private void copyFileToStorage(Uri sourceUri, File targetFile) throws IOException {
        try (InputStream in = getContentResolver().openInputStream(sourceUri);
             FileOutputStream out = new FileOutputStream(targetFile)) {
            if (in == null) throw new IOException("Unable to open file stream");
            
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        }
    }

    /**
     * Retrieves the file name from a URI.
     * @param uri The URI to get the file name from
     * @return The file name or "unknown_file" if it cannot be determined
     */
    private String getFileNameFromUri(Uri uri) {
        if (uri == null) return "unknown_file";
        
        if ("content".equals(uri.getScheme())) {
            try (Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (nameIndex != -1) return cursor.getString(nameIndex);
                }
            } catch (Exception e) {
                Log.w(TAG, "Failed to get filename", e);
            }
        }
        
        String pathSegment = uri.getLastPathSegment();
        return pathSegment != null ? pathSegment : "unknown_file";
    }

    /**
     * Fetches available sub-applications from the server.
     */
    private void fetchSubApplications() {
        String url = baseUrl + SUB_APPS_ENDPOINT;
        Request request = new Request.Builder()
            .url(url)
            .addHeader("Authorization", "Bearer " + token)
            .build();

        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e(TAG, "Failed to fetch sub-applications", e);
                runOnUiThread(() -> showErrorAndFinish("Network error occurred"));
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    Log.e(TAG, "Server error: " + response.code());
                    runOnUiThread(() -> showErrorAndFinish("Server error: " + response.code()));
                    return;
                }

                try {
                    String body = response.body().string();
                    JSONObject json = new JSONObject(body);
                    JSONArray subApps = json.getJSONArray("data");
                    runOnUiThread(() -> showSubAppSelectionDialog(subApps));
                } catch (Exception e) {
                    Log.e(TAG, "Response parsing error", e);
                    runOnUiThread(() -> showErrorAndFinish("Error processing server response"));
                }
            }
        });
    }

    /**
     * Displays a dialog for selecting a sub-application.
     * @param subApps JSONArray of available sub-applications
     */
    private void showSubAppSelectionDialog(JSONArray subApps) {
        List<String> appNames = new ArrayList<>();
        List<JSONObject> subAppList = new ArrayList<>();

        for (int i = 0; i < subApps.length(); i++) {
            try {
                JSONObject subApp = subApps.getJSONObject(i);
                appNames.add(subApp.optString("etdappAppName", "Unknown App"));
                subAppList.add(subApp);
            } catch (Exception e) {
                Log.w(TAG, "Error parsing sub-app", e);
            }
        }

        if (appNames.isEmpty()) {
            showErrorAndFinish("No sub-applications available");
            return;
        }

        new AlertDialog.Builder(this)
            .setTitle("Select Sub-Application")
            .setItems(appNames.toArray(new String[0]), 
                (dialog, which) -> handleSubAppSelection(subAppList.get(which)))
            .setNegativeButton("Cancel", (dialog, which) -> finish())
            .setCancelable(false)
            .show();
    }

    /**
     * Handles the selection of a sub-application and launches MainActivity.
     * @param subApp The selected sub-application JSONObject
     */
    private void handleSubAppSelection(JSONObject subApp) {
        try {
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putString("selectedSubApplication", subApp.optString("etdappAppName", "Unknown App"));
            editor.putString("selectedPath", subApp.optString("path", "Unknown Path"));
            editor.apply();
            
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(intent);
            finish();
        } catch (Exception e) {
            Log.e(TAG, "Error handling sub-app selection", e);
            showErrorAndFinish("Error launching sub-application");
        }
    }

    /**
     * Clears previous sub-application selection from SharedPreferences.
     */
    private void clearPreviousSelection() {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.remove("selectedSubApplication")
              .remove("selectedPath")
              .apply();
    }

    /**
     * Saves processed files information to SharedPreferences.
     * @param filesArray JSONArray containing file information
     */
    private void saveFilesInfo(JSONArray filesArray) {
        sharedPreferences.edit()
            .putString("sharedFiles", filesArray.toString())
            .apply();
    }

    /**
     * Displays an error message and finishes the activity.
     * @param message The error message to display
     */
    private void showErrorAndFinish(String message) {
        new AlertDialog.Builder(this)
            .setTitle("Error")
            .setMessage(message)
            .setPositiveButton("OK", (dialog, which) -> finish())
            .setCancelable(false)
            .show();
    }
}