package com.esd.freeapp.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.http.javanet.NetHttpTransport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;

@Service
public class GoogleTokenVerifierService {

    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifierService(@Value("${google.client.id}") String clientId) {
        verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public Optional<GoogleIdToken.Payload> verify(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            return Optional.ofNullable(idToken).map(GoogleIdToken::getPayload);
        } catch (GeneralSecurityException | IOException e) {
            return Optional.empty();
        }
    }
}
