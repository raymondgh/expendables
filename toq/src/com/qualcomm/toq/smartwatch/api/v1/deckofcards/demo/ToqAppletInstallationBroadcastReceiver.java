/*******************************************************************************
 * Copyright (c) 2014 Qualcomm Connected Experiences, Inc, All rights reserved
 ******************************************************************************/
package com.parseapp.expensetracker.toq;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParseAnalytics;
import com.parse.PushService;
import com.qualcomm.toq.smartwatch.api.v1.deckofcards.Constants;


/**
 * Broadcast receiver for Toq app install intent.
 * 
 * @author mcaunter
 */
public class ToqAppletInstallationBroadcastReceiver extends BroadcastReceiver{
    
    /**
     * @see android.content.BroadcastReceiver#onReceive(android.content.Context, android.content.Intent)
     */
    public void onReceive(Context context, Intent intent){

        Log.d(Constants.TAG, "ToqAppletInstallationBroadcastReceiver.onReceive - context: " + context + ", intent: " + intent);

        // Launch the demo app activity to complete the install of the deck of cards applet
        Intent launchIntent= new Intent(context, ToqApiDemo.class);
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); 

        context.startActivity(launchIntent);
    }

}
