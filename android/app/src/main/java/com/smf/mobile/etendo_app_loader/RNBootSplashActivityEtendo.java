package com.smf.mobile.etendo_app_loader;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class RNBootSplashActivityEtendo extends AppCompatActivity {

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    try {
      startActivity(new Intent(this, MainActivity.class));
      finish();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}