document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit
      .then(function getClient(_client) {
        window.client = _client;

      });

  }
};


//function to get the article name
function getArticleName() {

  const articleName = document.getElementById('search_query').value;
  if (articleName.length < 5) {
    document.getElementById('div').style.display = "none";
    document.getElementById('err').style.visibility = "visible";
    document.getElementById('err').innerHTML = "Error: Enter minimum 5 characters";
    return;
  }

  searchArticle(articleName)
}

var communityDomain
const headers = {
  "Authorization": "Basic <%= encode(iparam.discourse_api_key) %>",
  "Accept": "application/json"
};

//function to search for an article
async function searchArticle(articleName) {
  const iparam = await client.iparams.get('community_domain');
  communityDomain = iparam.community_domain;
  const options = { headers: headers };
  const encodedArticleName = encodeURI(articleName);
  const url = communityDomain + `/search.json?q=${encodedArticleName}`;
  client.request.get(url, options)
    .then(function (data) {
      console.log("Searching for document succeeded ", data);
      const topics = JSON.parse(data.response).topics.filter((article) => {
        return article.title.toLowerCase().includes(articleName.toLowerCase());
      })
      listArticles(topics)
    })
    .catch(function (error) {
      console.log("Searching for document failed : ", error);
      document.getElementById('div').style.display = "none";
      document.getElementById('err').style.visibility = "visible";
      document.getElementById('err').innerHTML = "Error: Enter the valid article name";
    });
}

//function to list all the articles related to our search query
var articleLink
function listArticles(topics) {
  const htmlString = topics.map((article) => {
    const url2 = communityDomain + "/t/";
    articleLink = url2 + article.slug + "/" + article.id;
    return `<li class="article">
    <button onclick="Paste()" id="apptext">${article.title}</button><br>
    </li>`;
  })
  document.getElementById('div').style.display = "inline";
  document.getElementById("topics").innerHTML = htmlString;
  document.getElementById('err').style.visibility = "hidden";
}

//function to paste the article link in ticket editor
function Paste() {
  client.interface.trigger("click", { id: "reply", text: `${articleLink}` })
}
