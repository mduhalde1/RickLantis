const axios = require('axios')
const url = 'https://integracion-rick-morty-api.herokuapp.com/api/';

module.exports = {

    friendlyName: 'Get by Id',
 
    description: 'Receives an id and get the location information.',
 
    inputs: {
       id: {
         description: 'The ID of the location to look up.',
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
         viewTemplatePath: 'pages/location'
       },
       notFound: {
         description: 'No location with the specified ID was found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function ({id}) {
        const getLocation= async () => {
        try {
        return await axios.get(url + 'location/' + id);
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


        var location = await getLocation();
        location = location.data;
        var ids_characters = [];
        const location_characters = location.residents;

        for (var i = 0; i < location_characters.length; i++) {
            var id_character = location_characters[i].split('/');
            ids_characters.push(id_character[id_character.length - 1]);
        }

        new_url = url + 'character/' +ids_characters.join();
        var characters_info = await getCharactersNames();
        
        characters_info = characters_info.data;
        characters = []
        if (ids_characters.length == 1){
          characters.push({'id': characters_info['id'], 'name': characters_info['name']})

        }else{
          for (var i = 0; i < characters_info.length; i++) {
            characters.push({'id': characters_info[i]['id'], 'name':  characters_info[i]['name']});
        }
        }

        location.residents = characters;
 
       // If no user was found, respond "notFound" (like calling `res.notFound()`)
       if (!location) { throw 'notFound'; }
 
       // Display a personalized welcome view.
       return {
         location: location
       };
    }
 };
