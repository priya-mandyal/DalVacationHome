package org.dalvacation;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.HashMap;
import java.util.Map;

public class CaesarCipherPostHandler implements RequestHandler<CaesarCipherRequest, MessageResponse> {

    private AmazonDynamoDB amazonDynamoDB;
    private final String DYNAMODB_TABLE_NAME = "userciphers";
    private final Regions REGION = Regions.US_EAST_1;

    @Override
    public MessageResponse handleRequest(CaesarCipherRequest request, Context context) {
        this.initDynamoDbClient();
        persistData(request.username(), request.shift());

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessage("Username and shift saved successfully");
        return messageResponse;
    }

    private void initDynamoDbClient() {
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard()
                .withRegion(REGION)
                .build();
    }

    private void persistData(String username, int shift) {
        Map<String, AttributeValue> attributesMap = new HashMap<>();
        attributesMap.put("username", new AttributeValue().withS(username));
        attributesMap.put("shift", new AttributeValue().withN(Integer.toString(shift)));

        amazonDynamoDB.putItem(DYNAMODB_TABLE_NAME, attributesMap);
    }
}

record CaesarCipherRequest(String username, int shift) {
}