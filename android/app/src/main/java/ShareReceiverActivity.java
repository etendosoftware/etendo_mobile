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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Activity to handle shared content (files) from other apps and process them for sub-application selection.
 */
public class ShareReceiverActivity extends AppCompatActivity {

    private static final String SHARED_PREFS_NAME = "group.com.etendoapploader.android";
    private static final String TAG = "ShareReceiverActivity";
    private static final int TIMEOUT_SECONDS = 30;

    private SharedPreferences sharedPreferences;
    private String token;
    private String urlToFetchSubApps;
    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .readTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .build();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initializeSharedPreferences();

        // Validate configuration before proceeding
        if (!isConfigurationValid()) {
            showDebugModal();
            return;
        }

        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }

    /**
     * Initializes SharedPreferences instance for the activity.
     */
    private void initializeSharedPreferences() {
        sharedPreferences = getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
    }

    /**
     * Validates if required configuration (token and URL) is present in SharedPreferences.
     * @return true if both token and URL are present, false otherwise
     */
    private boolean isConfigurationValid() {
        token = sharedPreferences.getString("token", null);
        urlToFetchSubApps = sharedPreferences.getString("urlToFetchSubApps", null);
        
        boolean isValid = !TextUtils.isEmpty(token) && !TextUtils.isEmpty(urlToFetchSubApps);
        if (!isValid) {
            Log.e(TAG, "Missing required configuration - Token: " + token + ", URL: " + urlToFetchSubApps);
        }
        return isValid;
    }

    /**
     * Shows a debug modal with configuration details when validation fails.
     */
    private void showDebugModal() {
        String message = "Configuration Check:\nToken: " + (token == null ? "Not set" : token) + 
                        "\nURL: " + (urlToFetchSubApps == null ? "Not set" : urlToFetchSubApps);
        createAlertDialog("Configuration Error", message, true).show();
    }

    /**
     * Processes the incoming Intent for shared content.
     * @param intent The incoming Intent to process
     */
    private void handleIntent(Intent intent) {
        if (intent == null || intent.getAction() == null) {
            Log.e(TAG, "Invalid intent received");
            showErrorAndFinish("Invalid share request");
            return;
        }

        try {
            String action = intent.getAction();
            switch (action) {
                case Intent.ACTION_SEND:
                    processSingleFileShare(intent);
                    break;
                case Intent.ACTION_SEND_MULTIPLE:
                    processMultipleFilesShare(intent);
                    break;
                default:
                    showErrorAndFinish("Unsupported action: " + action);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error processing share intent", e);
            showErrorAndFinish("Error processing shared content: " + e.getMessage());
        }
    }

    /**
     * Processes a single file share Intent.
     * @param intent The Intent containing a single file URI
     */
    private void processSingleFileShare(Intent intent) {
        Uri fileUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        if (fileUri == null) {
            showErrorAndFinish("No file received");
            return;
        }

        List<Uri> uriList = new ArrayList<>();
        uriList.add(fileUri);
        processFileUris(uriList);
    }

    /**
     * Processes a multiple files share Intent.
     * @param intent The Intent containing multiple file URIs
     */
    private void processMultipleFilesShare(Intent intent) {
        ArrayList<Uri> fileUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
        if (fileUris == null || fileUris.isEmpty()) {
            showErrorAndFinish("No files received");
            return;
        }
        processFileUris(fileUris);
    }

    /**
     * Processes a list of file URIs in a background thread.
     * @param uris List of file URIs to process
     */
    private void processFileUris(List<Uri> uris) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                JSONArray filesArray = buildFilesArray(uris);
                if (filesArray.length() > 0) {
                    saveFilesInfo(filesArray.toString());
                    fetchSubApplications();
                } else {
                    runOnUiThread(() -> showErrorAndFinish("No valid files processed"));
                }
            } catch (Exception e) {
                Log.e(TAG, "Error processing files", e);
                runOnUiThread(() -> showErrorAndFinish("Processing error: " + e.getMessage()));
            } finally {
                executor.shutdown();
            }
        });
    }

    /**
     * Builds a JSONArray containing information about processed files.
     * @param uris List of file URIs
     * @return JSONArray with file information
     * @throws IOException if file processing fails
     */
    private JSONArray buildFilesArray(List<Uri> uris) throws IOException {
        clearPreviousSelection();
        JSONArray filesArray = new JSONArray();
        
        for (Uri uri : uris) {
            try {
                JSONObject fileInfo = processSingleFile(uri);
                filesArray.put(fileInfo);
            } catch (Exception e) {
                Log.e(TAG, "Error processing file: " + uri, e);
            }
        }
        return filesArray;
    }

    /**
     * Clears previous sub-application selection data from SharedPreferences.
     */
    private void clearPreviousSelection() {
        sharedPreferences.edit()
                .remove("selectedSubApplication")
                .remove("selectedPath")
                .apply();
        Log.d(TAG, "Cleared previous selection data");
    }

    /**
     * Processes a single file and returns its information as a JSONObject.
     * @param uri The URI of the file to process
     * @return JSONObject containing file path, name, and MIME type
     * @throws IOException if file operations fail
     */
    private JSONObject processSingleFile(Uri uri) throws IOException {
        String fileName = getFileNameFromUri(uri);
        String mimeType = getContentResolver().getType(uri) != null ? 
                         getContentResolver().getType(uri) : "application/octet-stream";
        File outputFile = new File(getFilesDir(), fileName);

        try (InputStream in = getContentResolver().openInputStream(uri);
             FileOutputStream out = new FileOutputStream(outputFile)) {
            if (in == null) throw new IOException("Unable to open file stream");
            
            byte[] buffer = new byte[8192]; // Larger buffer for better performance
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        }

        JSONObject fileInfo = new JSONObject();
        try {
            fileInfo.put("path", outputFile.getAbsolutePath());
            fileInfo.put("name", fileName);
            fileInfo.put("mimeType", mimeType);
        } catch (JSONException e) {
            throw new IOException("Failed to create file info JSON", e);
        }
        return fileInfo;
    }

    /**
     * Extracts file name from a URI, falling back to a default if unavailable.
     * @param uri The URI to extract the name from
     * @return The file name or "unknown_file" if not determinable
     */
    private String getFileNameFromUri(Uri uri) {
        if (uri == null) return "unknown_file";

        if ("content".equals(uri.getScheme())) {
            try (Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (nameIndex != -1) {
                        return cursor.getString(nameIndex);
                    }
                }
            } catch (Exception e) {
                Log.w(TAG, "Failed to get file name from content URI", e);
            }
        }
        
        String pathSegment = uri.getLastPathSegment();
        return pathSegment != null ? pathSegment : "unknown_file";
    }

    /**
     * Saves processed files information to SharedPreferences.
     * @param filesJson JSON string containing files information
     */
    private void saveFilesInfo(String filesJson) {
        sharedPreferences.edit()
                .putString("sharedFiles", filesJson)
                .apply();
    }

    /**
     * Fetches sub-applications from the server using configured URL and token.
     */
    private void fetchSubApplications() {
        String url = urlToFetchSubApps + "/sws/com.etendoerp.dynamic.app.userApp";
        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + token)
                .build();

        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                runOnUiThread(() -> showErrorAndFinish(
                        "Network error: " + e.getMessage() + "\nURL: " + url));
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    runOnUiThread(() -> showErrorAndFinish(
                            "Server error " + response.code() + "\nURL: " + url));
                    return;
                }

                String responseBody = response.body() != null ? response.body().string() : "";
                try {
                    JSONObject json = new JSONObject(responseBody);
                    JSONArray subApps = json.getJSONArray("data");
                    runOnUiThread(() -> showSubApplicationsDialog(subApps));
                } catch (JSONException e) {
                    runOnUiThread(() -> showErrorAndFinish(
                            "Invalid response format: " + e.getMessage() + 
                            "\nResponse: " + responseBody));
                }
            }
        });
    }

    /**
     * Displays a dialog for selecting a sub-application from the fetched list.
     * @param subApps JSONArray containing sub-application data
     */
    private void showSubApplicationsDialog(JSONArray subApps) {
        List<String> appNames = new ArrayList<>();
        List<JSONObject> subAppObjects = new ArrayList<>();

        for (int i = 0; i < subApps.length(); i++) {
            try {
                JSONObject subApp = subApps.getJSONObject(i);
                String appName = subApp.optString("etdappAppName", "Unnamed App");
                appNames.add(appName);
                subAppObjects.add(subApp);
            } catch (JSONException e) {
                Log.w(TAG, "Error parsing sub-application", e);
            }
        }

        if (appNames.isEmpty()) {
            showErrorAndFinish("No sub-applications available");
            return;
        }

        createAlertDialog("Select Sub-Application", null, false)
                .setItems(appNames.toArray(new String[0]), 
                        (dialog, which) -> showConfirmationDialog(subAppObjects.get(which)))
                .setNegativeButton("Cancel", (d, w) -> finish())
                .show();
    }

    /**
     * Shows a confirmation dialog for the selected sub-application.
     * @param subApp The selected sub-application JSONObject
     */
    private void showConfirmationDialog(JSONObject subApp) {
        String name = subApp.optString("etdappAppName", "Unnamed App");
        String path = subApp.optString("path", "Unknown Path");
        String message = "Confirm selection:\n" +
                "Name: " + name + "\n" +
                "Path: " + path;

        createAlertDialog("Confirm Selection", message, false)
                .setPositiveButton("Confirm", (d, w) -> saveAndProceed(subApp))
                .setNegativeButton("Cancel", (d, w) -> finish())
                .show();
    }

    /**
     * Saves the selected sub-application data and proceeds to MainActivity.
     * @param subApp The selected sub-application JSONObject
     */
    private void saveAndProceed(JSONObject subApp) {
        try {
            sharedPreferences.edit()
                    .putString("selectedSubApplication", subApp.optString("etdappAppName", "Unnamed App"))
                    .putString("selectedPath", subApp.optString("path", "Unknown Path"))
                    .apply();
            launchMainActivity();
        } catch (Exception e) {
            Log.e(TAG, "Error saving sub-application data", e);
            showErrorAndFinish("Error saving selection: " + e.getMessage());
        }
    }

    /**
     * Launches the MainActivity with appropriate flags and finishes this activity.
     */
    private void launchMainActivity() {
        Intent intent = new Intent(this, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
        finish();
    }

    /**
     * Creates a standardized AlertDialog builder with common settings.
     * @param title The dialog title
     * @param message The dialog message (can be null)
     * @param finishOnDismiss Whether to finish the activity when dismissed
     * @return Configured AlertDialog.Builder instance
     */
    private AlertDialog.Builder createAlertDialog(String title, String message, boolean finishOnDismiss) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this)
                .setTitle(title)
                .setCancelable(false);
        
        if (message != null) {
            builder.setMessage(message);
        }
        
        if (finishOnDismiss) {
            builder.setPositiveButton("OK", (dialog, which) -> finish());
        }
        
        return builder;
    }

    /**
     * Displays an error message and finishes the activity.
     * @param message The error message to display
     */
    private void showErrorAndFinish(String message) {
        runOnUiThread(() -> createAlertDialog("Error", message, true).show());
    }
}