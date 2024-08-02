package org.dalvacation;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.*;

public class GetQuestionsHandler implements RequestHandler<Void, List<Question>> {

    private AmazonDynamoDB amazonDynamoDB;

    private String DYNAMODB_TABLE_NAME = "questions";
    private Regions REGION = Regions.US_EAST_1;

    public List<Question> handleRequest(Void input, Context context) {
        this.initDynamoDbClient();
        List<Question> questionList = new ArrayList<>();

        ScanRequest scanRequest = new ScanRequest()
                .withTableName(DYNAMODB_TABLE_NAME);

        ScanResult result = amazonDynamoDB.scan(scanRequest);

        for (Map<String, AttributeValue> item : result.getItems()) {
            questionList.add(new Question(Long.parseLong(item.get("id").getN()),item.get("question").getS()));

        }
        Collections.shuffle(questionList);

        // Select the first 3 items, or fewer if there are less than 3 questions
        return questionList.size() > 3 ? questionList.subList(0, 3) : questionList;
    }

    private void initDynamoDbClient() {
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard()
                .withRegion(REGION)
                .build();
    }
}
