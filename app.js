const { env } = require("process")

const express = require("express"),
      app = express(),
      dialogflow = require("@google-cloud/dialogflow").v2

const credentials = JSON.parse(process.env.CREDENTIALS)

const projectId =  process.env.PROJECT_ID
const languageCode = "en-US"

app.use("",express.static(__dirname))
app.use(express.json())


const sessionClient = new dialogflow.SessionsClient({
  projectId,
  credentials
});


app.get("/",(req,res)=>{
  res.sendFile("index.html",{root:"./"})
})


app.post("/",async (req,res)=>{

  const query = req.body.transcript
  const sessionId = "some_string"
  const response = await detectIntentandSentiment(sessionId,query)
  res.send(response)
})


async function detectIntentandSentiment(sessionId,query) {

  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
    queryParams: {
      sentimentAnalysisRequestConfig: {
        analyzeQueryTextSentiment: true,
      },
    },
  };

  
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(result)
  switch(result.intent.displayName)
  {

    case "Search":
      
      const search_query = result.parameters.fields.search_query.stringValue

      return {
        action:"search",
        search_query:search_query
      }

      case "Website":
        const website = result.parameters.fields.website.stringValue
        return {
          action:"website",
          website:website
        }

      default :
        const message = result.fulfillmentText
        return {
          action:"no_action",
          message:message
        }
  }
}



app.listen(process.env.PORT || 3000,()=>{
  console.log("Server is up and running.")
})