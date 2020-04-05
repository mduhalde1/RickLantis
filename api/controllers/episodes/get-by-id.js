
const axios = require('axios')
const url = 'https://rickandmortyapi.com/api/';

module.exports = {

    friendlyName: 'Get by Id',
 
    description: 'Receives an id and get the episode information.',
 
    inputs: {
       id: {
         description: 'The ID of the episode to look up.',
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
         viewTemplatePath: 'pages/episode'
       },
       notFound: {
         description: 'No episode with the specified ID was found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function ({id}) {
        var episode = id;
        const getEpisode = async () => {
        try {
        return await axios.get(url + 'episode/' + id);
        } catch (error) {
          console.error(error)
        }
        }
        const getCharactersNames = async () => {
        try {
            return await axios.get(new_url);
        } catch (error) {
            console.error(error)
        }
        }

        var episode = await getEpisode();

        var ids_characters = [];
        const episode_characters = episode.data.characters;

        for (var i = 0; i < episode_characters.length; i++) {
            var id_character = episode_characters[i].split('/');
            ids_characters.push(id_character[id_character.length - 1]);
        }

        new_url = url + 'character/' +ids_characters.join();
        var characters_info = await getCharactersNames();
        characters_info = characters_info.data;
        characters = []
        for (var i = 0; i < characters_info.length; i++) {
            characters.push({'id': characters_info[i]['id'], 'name':  characters_info[i]['name']});
        }

        episode.data.characters = characters
 
       // If no user was found, respond "notFound" (like calling `res.notFound()`)
       if (!episode) { throw 'notFound'; }
 
       // Display a personalized welcome view.
       return {
         episode: episode.data
       };
    }
 };
