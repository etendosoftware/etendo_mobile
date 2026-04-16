package com.smf.mobile.etendo_app_loader

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class RNBootSplashActivityEtendo : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val intent = Intent(this, MainActivity::class.java)
        val extras = getIntent().extras
        if (extras != null) {
            intent.putExtras(extras)
        }
        startActivity(intent)
        finish()
    }
}
