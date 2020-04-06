
const axios = require('axios')
const url = 'https://integracion-rick-morty-api.herokuapp.com/api/';

module.exports = {

    friendlyName: 'Get by Id',
 
    description: 'Receives an id and get the character information.',
 
    inputs: {
       id: {
         description: 'The ID of the character to look up.',
         // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
         // if the `userId` parameter is not a number.
         type: 'number',
         // By making the `userId` parameter required, Sails will automatically respond with
         // `res.badRequest` if it's left out.
         required: true
       }
    },
 
    exits: {
       success: {
         responseType: 'view',
         viewTemplatePath: 'pages/character'
       },
       notFound: {
         description: 'No character with the specified ID was found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function ({id}) {

        const getCharacter = async () => {
        try {
        return await axios.get(url + 'character/' + id);
        } catch (error) {
          console.error(error)
        }
        }

        const getEpisodesNames = async () => {
            try {
                return await axios.get(new_url);
            } catch (error) {
                console.error(error)
            }
        }

        var character = await getCharacter();
        character = character.data

        var location_id = character.location['url'].split('/')
        character.location['id'] = location_id[location_id.length - 1]

        var origin_id = character.origin['url'].split('/')
        character.origin['id'] = origin_id[origin_id.length - 1]

        // look for episodes
        var episodes = character.episode;
        var ids_episodes = [];

        for (var i = 0; i < episodes.length; i++) {
            var id_episode = episodes[i].split('/');
            ids_episodes.push(id_episode[id_episode.length - 1]);
        }

        new_url = url + 'episode/' + ids_episodes.join();
        var episodes_info = await getEpisodesNames();
        episodes = episodes_info.data;
        episodes_info = []


        if (ids_episodes.length == 1){
          episodes_info.push({'id': episodes.id, 'name': episodes.name})
        } else {
          for (var i = 0; i < episodes.length; i++) {
            episodes_info.push({'id': episodes[i]['id'], 'name':  episodes[i]['name']});
        }
        }
        character.episode = episodes_info;
 
       // If no user was found, respond "notFound" (like calling `res.notFound()`)
       if (!character) { throw 'notFound'; }
 
       // Display a personalized welcome view.
       return {
         character: character
       };
    }
 };
