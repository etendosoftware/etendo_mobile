package com.smf.mobile.etendo_app_loader;

import android.os.Bundle;
import android.database.Cursor;
import android.database.CursorWindow;
import java.lang.reflect.Field;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    try {
    Field field = CursorWindow.class.getDeclaredField("sCursorWindowSize");
    field.setAccessible(true);
    field.set(null, 200 * 1024 * 1024); //the 100MB is the new size
    } catch (Exception e) {
       e.printStackTrace();
    }
    super.onCreate(null);
  }


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Etendo_Mobile";
    }

}
