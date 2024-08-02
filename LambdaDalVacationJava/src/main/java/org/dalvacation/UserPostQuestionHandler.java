package org.dalvacation;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.ConditionalCheckFailedException;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.amazonaws.services.lambda.runtime.Context;

public class UserPostQuestionHandler implements RequestHandler<UserQuestionsRequest, MessageResponse> {

    private AmazonDynamoDB amazonDynamoDB;

    private String DYNAMODB_TABLE_NAME = "userquestions";
    private Regions REGION = Regions.US_EAST_1;

    public MessageResponse handleRequest(UserQuestionsRequest userQuestionsRequest, Context context) {
        this.initDynamoDbClient();

        persistData(userQuestionsRequest);

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessage("Saved Successfully");
        return messageResponse;
    }

    private void persistData(UserQuestionsRequest userQuestionsRequest) throws ConditionalCheckFailedException {

        Map<String, AttributeValue> attributesMap = new HashMap<>();

        attributesMap.put("username", new AttributeValue().withS((userQuestionsRequest.username())));
        attributesMap.put("questions", new AttributeValue().withL(
                userQuestionsRequest.questions().stream().map(question -> {
                    Map<String, AttributeValue> questionMap = new HashMap<>();
                    questionMap.put("id", new AttributeValue().withN(Long.toString(question.id())));
                    questionMap.put("answer", new AttributeValue(question.answer()));
                    return new AttributeValue().withM(questionMap);
                }).collect(Collectors.toList())
        ));

        amazonDynamoDB.putItem(DYNAMODB_TABLE_NAME, attributesMap);
    }

    private void initDynamoDbClient() {
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard()
                .withRegion(REGION)
                .build();
    }
}
record QuestionRequests(long id, String answer) {
}

record UserQuestionsRequest(String username, List<QuestionRequests> questions) {
}