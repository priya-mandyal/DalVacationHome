package org.dalvacation;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ConditionalCheckFailedException;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.HashMap;
import java.util.Map;

public class PostQuestionHandler implements RequestHandler<QuestionRequest, MessageResponse> {
    private AmazonDynamoDB amazonDynamoDB;

    private String DYNAMODB_TABLE_NAME = "questions";
    private Regions REGION = Regions.US_EAST_1;

    public MessageResponse handleRequest(QuestionRequest questionRequest, Context context) {
        this.initDynamoDbClient();

        persistData(questionRequest);

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessage("Saved Successfully");
        return messageResponse;
    }

    private void persistData(QuestionRequest questionRequest) throws ConditionalCheckFailedException {

        Map<String, AttributeValue> attributesMap = new HashMap<>();

        attributesMap.put("id",  new AttributeValue().withN(Long.toString(System.currentTimeMillis())));
        attributesMap.put("question", new AttributeValue(questionRequest.question()));

        amazonDynamoDB.putItem(DYNAMODB_TABLE_NAME, attributesMap);
    }

    private void initDynamoDbClient() {
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard()
                .withRegion(REGION)
                .build();
    }
}

record QuestionRequest(String question) {
}

