package com.parseapp.expensetracker.toq;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParseAnalytics;
import com.parse.PushService;
import com.qualcomm.toq.smartwatch.api.v1.deckofcards.Constants;

import org.json.JSONObject;
import org.json.JSONException;
import java.util.Iterator;

public class MyCustomReceiver extends BroadcastReceiver {
    private static final String TAG = "MyCustomReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        try {
            String action = intent.getAction();
            String channel = intent.getExtras().getString("com.parse.Channel");
            JSONObject json = new JSONObject(intent.getExtras().getString("com.parse.Data"));

            Log.d(TAG, "got action " + action + " on channel " + channel + " with:");
            Iterator itr = json.keys();

            String tripId = "";

            while (itr.hasNext()) {
                String key = (String) itr.next();
                Log.d(TAG, "..." + key + " => " + json.getString(key));
                if(key.equals("tripId")){
                    tripId = json.getString(key);
                }
            }

            SendPushToActivity(context,intent, tripId);
        } catch (JSONException e) {
            Log.d(TAG, "JSONException: " + e.getMessage());
        }
    }

    public void SendPushToActivity (Context context, Intent intent, String tripId) {
        Intent launchIntent= new Intent(context, ToqApiDemo.class);
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        launchIntent.putExtra("tripId", tripId);
        context.startActivity(launchIntent);
    }
}