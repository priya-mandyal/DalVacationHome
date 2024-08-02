package org.dalvacation;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.QueryRequest;
import com.amazonaws.services.dynamodbv2.model.QueryResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ValidateUserAnswer implements RequestHandler<ValidateUserAnswerRequest, ValidateUserAnswerResponse> {

    private AmazonDynamoDB amazonDynamoDB;

    private final String USER_QUESTIONS_TABLE_NAME = "userquestions";
    private final Regions REGION = Regions.US_EAST_1;

    @Override
    public ValidateUserAnswerResponse handleRequest(ValidateUserAnswerRequest request, Context context) {
        this.initDynamoDbClient();

        boolean isValid = validateAnswer(request.username(), request.id(), request.answer());
        String message = isValid ? "Correct Answer" : "Incorrect Answer";

        return new ValidateUserAnswerResponse(message, isValid);
    }

    private void initDynamoDbClient() {
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard()
                .withRegion(REGION)
                .build();
    }

    private boolean validateAnswer(String username, long questionId, String answer) {
        Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
        expressionAttributeValues.put(":v_username", new AttributeValue().withS(username));

        QueryRequest queryRequest = new QueryRequest()
                .withTableName(USER_QUESTIONS_TABLE_NAME)
                .withKeyConditionExpression("username = :v_username")
                .withExpressionAttributeValues(expressionAttributeValues);

        QueryResult queryResult = amazonDynamoDB.query(queryRequest);

        List<Map<String, AttributeValue>> items = queryResult.getItems();
        if (items.isEmpty()) {
            return false;
        }

        Map<String, AttributeValue> item = items.get(0);
        List<AttributeValue> questions = item.get("questions").getL();

        for (AttributeValue question : questions) {
            Map<String, AttributeValue> questionMap = question.getM();
            long id = Long.parseLong(questionMap.get("id").getN());
            String storedAnswer = questionMap.get("answer").getS();

            if (id == questionId) {
                return storedAnswer.equals(answer);
            }
        }

        return false;
    }
}

record ValidateUserAnswerRequest(long id, String username, String answer) {
}

class ValidateUserAnswerResponse {
    private String message;
    private boolean isValid;

    public ValidateUserAnswerResponse(String message, boolean isValid) {
        this.message = message;
        this.isValid = isValid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isValid() {
        return isValid;
    }

    public void setValid(boolean isValid) {
        this.isValid = isValid;
    }
}
