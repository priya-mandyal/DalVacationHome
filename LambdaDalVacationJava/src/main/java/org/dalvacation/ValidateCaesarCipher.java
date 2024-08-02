package org.dalvacation;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.GetItemRequest;
import com.amazonaws.services.dynamodbv2.model.GetItemResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.HashMap;
import java.util.Map;

public class ValidateCaesarCipher implements RequestHandler<ValidateCaesarCipherRequest, Map<String, Boolean>> {

    private AmazonDynamoDB amazonDynamoDB;
    private final String DYNAMODB_TABLE_NAME = "userciphers";
    private final Regions REGION = Regions.US_EAST_1;

    @Override
    public Map<String, Boolean> handleRequest(ValidateCaesarCipherRequest request, Context context) {
        this.initDynamoDbClient();
        int shift = getShiftForUsername(request.username());

        if (shift == -1) {
            return Map.of("isCorrect", false);
        }

        String encryptedText = caesarCipher(request.originalText(), shift);
        boolean isCorrect = encryptedText.equals(request.caesarCipher());

        return Map.of("isCorrect", isCorrect);
    }

    private void initDynamoDbClient() {
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard()
                .withRegion(REGION)
                .build();
    }

    private int getShiftForUsername(String username) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("username", new AttributeValue().withS(username));

        GetItemRequest getItemRequest = new GetItemRequest()
                .withTableName(DYNAMODB_TABLE_NAME)
                .withKey(key);

        GetItemResult getItemResult = amazonDynamoDB.getItem(getItemRequest);

        if (getItemResult.getItem() != null && getItemResult.getItem().containsKey("shift")) {
            return Integer.parseInt(getItemResult.getItem().get("shift").getN());
        }

        return -1; // return -1 if shift is not found
    }

    public static String caesarCipher(String str, int shift) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char currentChar = str.charAt(i);
            if (currentChar >= 'A' && currentChar <= 'Z') {
                int currentCharPosition = currentChar - 'A';
                int newCharPosition = (currentCharPosition + shift) % 26;
                char newChar = (char) (newCharPosition + 'A');
                result.append(newChar);
            } else {
                result.append(currentChar); // Keep non-uppercase characters unchanged
            }
        }
        return result.toString();
    }
}

record ValidateCaesarCipherRequest(String username, String originalText, String caesarCipher) {
}