import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
	server: {
		apiKey: "xyz",
		nodes: [
			{
				host: "docker-dev.butler.edu",
				port: "8108",
				protocol: 'https'
			}
		]
	},
	additionalSearchParameters: {
		queryBy: "emplid,email"
	}
})
const searchClient = typesenseInstantsearchAdapter.searchClient;

const search = instantsearch({
	searchClient,
	indexName: 'profiles'
});

search.addWidgets([
	instantsearch.widgets.searchBod({
		container: '#searchbox',
	}),
	instantsearch.widgets.hits({
		container: '#hits',
		templates: {
			item: `
				<div>
					<img src="" alt="photo"/>
					<p>noice</p>
				</div>
			`,
		},
	}),
	instantsearch.widgets.pagination({
		container: '#pagination',
	})
])

let profileSchema = {
    'name': 'profiles',
    'fields': [
        {'name': 'emplid', 'type': 'string'},
        {'name': 'first_name', 'type': 'string'},
        {'name': 'last_name', 'type': 'string'},
        {'name': 'username', 'type': 'string'},
        {'name': 'email', 'type': 'string'},
        {'name': 'phone', 'type': 'string'},
        {'name': 'location', 'type': 'string'},
        {'name': 'photo', 'type': 'string'},
    ],
    'default_sorting_field': 'first_name'
}
client.collections().create(profilesSchema)
    .then(function(data) {
        console.log(data)
    })

var fs = require('fs/promises')

const [profilesJSON, setProfiles] = useState(null)

    const requestProfiles = `${apiUrl}profiles`;
    console.log("Requesting Profiles")
    useEffect( () => {
        setLoading(true)
        fetch(requestProfiles)
            .then((res) => res.json())
            .then((profiles) => {
                setProfiles(profiles)
                setLoading(false)
                console.log("Profiles: " + profilesJSON)
            })
    }, [])

    client.collections("profiles").documents().import(profilesJSON)