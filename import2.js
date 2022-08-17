async function main() {
    const Typesense = require("typesense");
    const fs = require('fs');

    let client = new Typesense.Client({
        'nodes': [
            {
                'host': "docker-dev.butler.edu",
                'port': "8108",
                'protocol': 'https'
            }
        ],
        'apiKey': 'local-typesense-api-key',
        'connectionTimeoutSeconds': 20
    })
    let profilesSchema = {
        'name': 'profiles',
        'fields': [
            {'name': 'emplid', 'type': 'int32', 'facet': true},
            {'name': 'firstname', 'type': 'string'},
            {'name': 'lastname', 'type': 'string'},
            {'name': 'department', 'type': 'string'}
           
        ],
        'default_sorting_field': 'emplid'
    };
    let usersOneSchema = {
        'name': 'usersOne',
        "enable_nested_fields": true,
        'fields': [
            {'name': 'emplid', 'type': 'int32', 'facet': true},
            {'name': 'email', 'type': 'string', 'facet': true},
            {'name': 'phone', 'type': 'string', 'optional': true, 'facet': true},
            {'name': 'firstname', 'type': 'string', 'facet': true},
            {'name': 'lastname', 'type': 'string', 'facet': true},
            {'name': 'username', 'type': 'string', 'facet': true},
            {'name': 'userGroups', 'type': 'string[]', 'facet': true},
        ],
        'default_sorting_field': 'emplid'
    };
    let usersSchema = {
        'name': 'users',
        'fields': [
            {'name': 'emplid', 'type': 'int32', 'facet': true},
            {'name': 'email', 'type': 'string', 'facet': true},
            {'name': 'phone', 'type': 'string', 'optional': true, 'facet': true},
            {'name': 'location', 'type': 'string', 'optional': true},
            {'name': 'firstname', 'type': 'string', 'facet': true},
            {'name': 'middlename', 'type': 'string', 'optional': true},
            {'name': 'lastname', 'type': 'string', 'facet': true},
            {'name': 'photo', 'type': 'string', 'optional': true},
            {'name': 'username', 'type': 'string', 'facet': true},
           
        ],
        'default_sorting_field': 'emplid'
    };

    

    // // Delete Schema
    await client.collections("usersOne").delete();

    // Create Schema
    async function test() {    
        try {
            const data = await client.collections().create(usersOneSchema)
            console.log("data", data);
        }catch(err){
            console.log(err)
        }
    }
    test();
    
    

    let profile = '{"emplid": 1, "first_name": "John", "last_name": "Lennon", "username": "jlennon", "email": "jlennon@butler.edu", "phone": "317-605-4992", "location": "HB-350", "photo": "test.jpg" }'
    // Import profiles

    fs.readFile('/srv/stack/AppDev_Directory/output.jsonl', 'utf8', async (err,data) => {
        if(err){
            console.error(err);
            return;
        }
        // console.log(data);
        const profileData = data;
        profile = profileData;
        console.log("profile1",profile)
        let res = await client.collections("usersOne").documents().import(JSON.parse(profile), {action: 'create'})
        console.log("import", res)
    }) 
}
main();