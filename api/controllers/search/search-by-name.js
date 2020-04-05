
const axios = require('axios')
var _ = require('lodash');
const url = 'https://rickandmortyapi.com/api/';

module.exports = {

    friendlyName: 'Get by word',
 
    description: 'Receives a word and searches if theres an episode, character and location with that name.',
 
    inputs: {
       name: {
         description: 'The name of the word to look up.',
         // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
         // if the `userId` parameter is not a number.
         type: 'string',
         // By making the `userId` parameter required, Sails will automatically respond with
         // `res.badRequest` if it's left out.
         required: false
       }
    },
 
    exits: {
       success: {
         responseType: 'view',
         viewTemplatePath: 'pages/search'
       },
       notFound: {
         description: 'No episode/character/location with the specified word was found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function ({name}) {
      var result = {}
        if (!name){
          name = ''
        }
        result = {'search': name}
        name = name.split(' ').join('%20');

        // for episode:
        const getEpisode = async (url_api) => {
            try {
                return await axios.get(url_api);
            } catch (error) {
                return {};
            }
        }

        var episodes = await getEpisode(url + 'episode/?name=' + name);
        var results = episodes.data.results
        var new_url = episodes.data.info.next
        while (new_url != ''){
          episodes = await getEpisode(new_url);
          results.push.apply(results, episodes.data.results)
          new_url = episodes.data.info.next;
        }
        episode_id_name = []
        if(!_.isEmpty(result)) {
          for (var i = 0; i < results.length; i++) {
            episode_id_name.push({'id': results[i].id, 'name': results[i].name})
          }
         result['episodes'] =  episode_id_name
        } 

        // for location:
        const getLocation = async (url_api) => {
            try {
                return await axios.get(url_api);
            } catch (error) {
                return {};
            }
        }
        
        var locations = await getLocation(url + 'location/?name=' + name);
        results = locations.data.results
        var new_url = locations.data.info.next
        while (new_url != ''){
          locations = await getLocation(new_url);
          results.push.apply(results, locations.data.results)
          new_url = locations.data.info.next;
        }
        location_id_name = []
        if(!_.isEmpty(results)) {
          for (var i = 0; i < results.length; i++) {
                location_id_name.push({'id': results[i].id, 'name': results[i].name})
              }
             result['locations'] =  location_id_name
        } 
        
        // for character:
        const getCharacter = async (url_api) => {
            try {
                return await axios.get(url_api);
            } catch (error) {
                return {};
            }
        }
        var characters = await getCharacter(url + 'character/?name=' + name);
        results = characters.data.results
        var new_url = characters.data.info.next
        while (new_url != ''){
          characters = await getCharacter(new_url);
          results.push.apply(results, characters.data.results)
          new_url = characters.data.info.next;
        }
        character_id_name = []
        if(!_.isEmpty(results)) {
          for (var i = 0; i < results.length; i++) {
            character_id_name.push({'id': results[i].id, 'name': results[i].name})
          } 
          result['characters'] = character_id_name
        } 
       if (!result) { throw 'notFound'; }
       // Display a personalized welcome view.
       return {
         result: result
       };
    }
 };
