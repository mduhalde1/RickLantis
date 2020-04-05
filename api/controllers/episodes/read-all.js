
const axios = require('axios')
const url = 'https://rickandmortyapi.com/api/';

module.exports = {

    friendlyName: 'Read all episodes',
 
    description: 'Home page shows all episodes',
 
    inputs: {
    },
 
    exits: {
       success: {
         responseType: 'view',
         viewTemplatePath: 'pages/homepage'
       },
       notFound: {
         description: 'No episodes were found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function () {


        const getEpisodes = async (url_api) => {
        try {
        return await axios.get(url_api);
        } catch (error) {
          console.error(error)
        }
        }


        var episodes = await getEpisodes(url + 'episode');
        var results = episodes.data.results
        var new_url = episodes.data.info.next
        while (new_url != ''){
          episodes = await getEpisodes(new_url);
          results.push.apply(results, episodes.data.results)
          new_url = episodes.data.info.next;
        }


       // If no user was found, respond "notFound" (like calling `res.notFound()`)
       if (!episodes) { throw 'notFound'; }
        
       // Display a personalized welcome view.
       return {
         episodes: results
       };
    }
 };
