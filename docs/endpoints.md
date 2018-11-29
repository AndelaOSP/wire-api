All data sent and received is in *JSON* format. All responses are in [Jsend format](https://labs.omniti.com/labs/jsend). This is the [baseURL](https://wireapi-staging.herokuapp.com) for all endpoints.

## POST Login a user

Allows an  authorized user to login.The body is a json object as sampled below. The login method gives the user a token that enables them to perfom some of the routes/endpoints enlisted below.


### Sample request
`url --request POST`

#### url
`/api/users/login`

#### payload

```
{
  "email": "mercy.muchai@andela.com"
}
```

### Sample response
```
{
    "message": "You were successfully logged in",
    "user": {
        "id": "U7LHY6W4B",
        "email": "mercy.muchai@andela.com",
        "username": "Mercy Muchai",
        "imageUrl": "https://secure.gravatar.com/avatar/cf493cf28e96f654602b2f71e4d655e2.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-48.png",
        "createdAt": "2018-05-06T09:00:48.164Z",
        "updatedAt": "2018-05-06T09:00:48.164Z",
        "locationId": "cjee24xnn0000i2xsh9qauyn5",
        "roleId": 2
    },
    "userToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlU3TEhZNlc0QiIsInJvbGVJZCI6MiwiaWF0IjoxNTI1NTk3NzUzLCJleHAiOjE1MjU2ODQxNTN9.mZOVACZrDguQklJZXx57Eu2rNTMF9hMoYEYf74Pxozo",
    "expiresIn": "24h"
}
```
## POST Location

Allows a user to post location.

### Sample request
`curl --request POST`

#### url
`/api/locations`

#### payload
```
{
	"name": "Narnia",
	"centre": "Nairobi",
	"country": "Kenya"
}
```

### Sample response
```
{
   "id": "cjp2mbox80000z4v24mbtpox5",
   "name": "Narnia",
   "centre": "Nairobi",
   "country": "Kenya",
   "updatedAt": "2018-11-29T13:11:45.646Z",
   "createdAt": "2018-11-29T13:11:45.646Z"
}
```

## GET Locations

To get all existing locations

### Sample request
`curl --request GET`

#### url
`/api/locations`

### Sample response
```
{
    "data": {
        "locations": [
            {
                "id": "cjee22lsq0000cqxs5tmmpf1g",
                "name": "Quiet Room",
                "centre": "Nairobi",
                "country": "Kenya",
                "createdAt": "2018-11-28T12:42:58.521Z",
                "updatedAt": "2018-11-28T12:42:58.521Z"
            },
            {
                "id": "cjee241h20000g7xsfzd572sl",
                "name": "Cafeteria",
                "centre": "Nairobi",
                "country": "Kenya",
                "createdAt": "2018-11-28T12:42:58.521Z",
                "updatedAt": "2018-11-28T12:42:58.521Z"
            }
        ]
    },
    "status": "success"
}
```

## POST Incident

Allows a user to post an incident. The body is a json object as sampled below. Some of the values can be left out when posting. These include: **witnesses** and **levelId**

### Sample request
`curl --request POST`

#### url
`/api/incidents`

### Sample response
```
 {
    "id": "cjfjgiroz0001lexs5h8kx4d5",
    "subject": "Harrassment",
	  "description": "something happened and I didnt like it at all",
    "dateOccurred": "12-7-2017",
    "incidentReporter": {
        "userId": "brian",
        "email": "brian@g.com",
        "username": "brian",
        "imageUrl": "brian.jpeg",
        "reporterLocation": {"name": "Again", "centre": "Nairobi", "country": "Kenya"}
    },
     "location": {
        "name": "bottle",
        "centre": "lagos",
        "country": "kenya"
    },
    "witnesses": [
        {
            "userId": "2nd",
            "email": "person2@gmail.com",
            "username": "person2",
            "imageUrl": "person2.jpeg",
            "witnessLocation": {"name": "new", "centre": "Nairobi", "country": "Kenya"}
        },
        {
            "userId": "3rd",
            "email": "person3@gmail.com",
            "username": "person3",
            "imageUrl": "person3.jpeg",
            "witnessLocation": {"name": "Another", "centre": "Nairobi", "country": "Kenya"}
        }
        ]
    }
```

## GET Incidents

To get all existing incidents

### Sample request
`curl --request GET`

#### url
`/api/incidents`

### Sample response
```
{
    "data": {
        "incidents": [
            {
                "id": "cjgxo8kr400010w3kypkj24hv",
                "description": "something happened and I didnt like it at all",
                "subject": "Harrassment",
                "dateOccurred": "2017-07-12T00:00:00.000Z",
                "createdAt": "2018-05-08T12:48:49.936Z",
                "updatedAt": "2018-05-08T12:48:49.936Z",
                "categoryId": null,
                "statusId": 1,
                "locationId": "cjgxo8kqc00000w3kxjh1gf31",
                "levelId": 3,
                "Level": {
                    "name": "Green"
                },
                "Status": {
                    "status": "Pending"
                },
                "Location": {
                    "name": "bottle",
                    "centre": "lagos",
                    "country": "kenya"
                },
                "assignees": [],
                "reporter": {
                    "id": "brian",
                    "email": "brian@g.com",
                    "username": "brian",
                    "imageUrl": "brian.jpeg",
                    "createdAt": "2018-05-08T12:48:49.967Z",
                    "updatedAt": "2018-05-08T12:48:49.967Z",
                    "locationId": "cjgxo8krj00020w3k8oenlg5k",
                    "roleId": 1
                },
                "witnesses": [
                    {
                        "id": "3rd",
                        "email": "person3@g.com",
                        "username": "person3",
                        "imageUrl": "person3.jpeg",
                        "createdAt": "2018-05-08T12:48:50.039Z",
                        "updatedAt": "2018-05-08T12:48:50.039Z",
                        "locationId": "cjgxo8kte00040w3k6v96gwes",
                        "roleId": 1
                    },
                    {
                        "id": "2nd",
                        "email": "person2@g.com",
                        "username": "person2",
                        "imageUrl": "person2.jpeg",
                        "createdAt": "2018-05-08T12:48:50.027Z",
                        "updatedAt": "2018-05-08T12:48:50.027Z",
                        "locationId": "cjgxo8ksw00030w3kz0r2inkn",
                        "roleId": 1
                    }
                ]
            },
            {
                "id": "cjfkubrlv0001tgxs3mre",
                "description": "Someone said some things to me I cannot even type",
                "subject": "Abusive Language",
                "dateOccurred": "2017-12-10T00:00:00.000Z",
                "createdAt": "2018-05-08T08:19:00.958Z",
                "updatedAt": "2018-05-08T08:19:00.958Z",
                "categoryId": 2,
                "statusId": 2,
                "locationId": "cjee256gt0000ioxs69v4870x",
                "levelId": 1,
                "Level": {
                    "name": "Red"
                },
                "Status": {
                    "status": "In Progress"
                },
                "Location": {
                    "name": "Bootcamp Room",
                    "centre": "Kampala",
                    "country": "Uganda"
                },
                "assignees": [],
                "reporter": {
                    "id": "U7LHY6W4B",
                    "email": "mercy.muchai@andela.com",
                    "username": "Mercy Muchai",
                    "imageUrl": "https://secure.gravatar.com/avatar/cf493cf28e96f654602b2f71e4d655e2.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-48.png",
                    "createdAt": "2018-05-08T08:19:02.241Z",
                    "updatedAt": "2018-05-08T08:19:02.241Z",
                    "locationId": "cjee24xnn0000i2xsh9qauyn5",
                    "roleId": 2
                },
                "witnesses": [
                    {
                        "id": "U7LEPG8LF",
                        "email": "batian.muthoga@andela.com",
                        "username": "Batian Muthoga",
                        "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
                        "createdAt": "2018-05-08T08:19:02.241Z",
                        "updatedAt": "2018-05-08T08:19:02.241Z",
                        "locationId": "cjee24xnn0000i2xsh9qauyn5",
                        "roleId": 2
                    }
                ]
            },
            {
                "id": "cjfkubrlv0001tsjksuis3",
                "description": "Someone said something that was discriminative to my gender",
                "subject": "Discrimination",
                "dateOccurred": "2018-02-03T00:00:00.000Z",
                "createdAt": "2018-05-08T08:19:00.958Z",
                "updatedAt": "2018-05-08T08:19:00.958Z",
                "categoryId": 15,
                "statusId": 3,
                "locationId": "cjee241h20000g7xsfzd572sl",
                "levelId": 3,
                "Level": {
                    "name": "Green"
                },
                "Status": {
                    "status": "Resolved"
                },
                "Location": {
                    "name": "Cafeteria",
                    "centre": "Nairobi",
                    "country": "Kenya"
                },
                "assignees": [],
                "reporter": {
                    "id": "U7LEPG8LF",
                    "email": "batian.muthoga@andela.com",
                    "username": "Batian Muthoga",
                    "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
                    "createdAt": "2018-05-08T08:19:02.241Z",
                    "updatedAt": "2018-05-08T08:19:02.241Z",
                    "locationId": "cjee24xnn0000i2xsh9qauyn5",
                    "roleId": 2
                },
                "witnesses": [
                    {
                        "id": "U7LHY6W4B",
                        "email": "mercy.muchai@andela.com",
                        "username": "Mercy Muchai",
                        "imageUrl": "https://secure.gravatar.com/avatar/cf493cf28e96f654602b2f71e4d655e2.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-48.png",
                        "createdAt": "2018-05-08T08:19:02.241Z",
                        "updatedAt": "2018-05-08T08:19:02.241Z",
                        "locationId": "cjee24xnn0000i2xsh9qauyn5",
                        "roleId": 2
                    }
                ]
            }
        ]
    },
    "status": "success"
}
```
##  GET Incident

To get one existing incident

### Sample request
`curl --request GET`

#### url
`/api/incidents/<incidentId>`

### Sample response
```
 {
    "id": "cjfkubrlv0001tsjksuis3",
    "subject": "Harrassment",
	  "description": "something happened and I didnt like it at all",
    "dateOccurred": "12-7-2017",
    "incidentReporter": {
        "userId": "brian",
        "email": "brian@g.com",
        "username": "brian",
        "imageUrl": "brian.jpeg",
        "reporterLocation": {"name": "Again", "centre": "Nairobi", "country": "Kenya"}
    },
     "location": {
        "name": "bottle",
        "centre": "lagos",
        "country": "kenya"
    },
    "witnesses": [
        {
            "userId": "2nd",
            "email": "person2@gmail.com",
            "username": "person2",
            "imageUrl": "person2.jpeg",
            "witnessLocation": {"name": "new", "centre": "Nairobi", "country": "Kenya"}
        },
        {
            "userId": "3rd",
            "email": "person3@gmail.com",
            "username": "person3",
            "imageUrl": "person3.jpeg",
            "witnessLocation": {"name": "Another", "centre": "Nairobi", "country": "Kenya"}
        }
        ]
    }
```

## PUT Incident

This endpoint is made use of when updating an assignee to an incident. Can only take one assignee and multiple CCD users. It's also made use of when updating the status from Pending to In progress/Resolved or the level.

### Sample request

`curl --request PUT`

#### url
`/api/incidents/<incidentId>`

#### payload
```
{
   "assignee":
    {
      "userId": "abcdef"
    }
}
```
It can also be an array of users to CC. i.e
```
{
    "ccd":
    [
        {
          "userId": "abcdef"
        },
        {
          "userId": "ijklm"
	       }
    ]
}
```
It could also be:
```
{
    "levelId": "2",
    "statusId": "2"
}
```

### Sample response
```
 {
    "status": "success",
    "data": {
      "id": "cjfkubrlv0001tsjksuis3",
        "subject": "Harrassment",
    	  "description": "something happened and I didnt like it at all",
        "dateOccurred": "12-7-2017",
        "incidentReporter": {
            "userId": "brian",
            "email": "brian@g.com",
            "username": "brian",
            "imageUrl": "brian.jpeg",
            "reporterLocation": {"name": "Again", "centre": "Nairobi", "country": "Kenya"}
        },
         "location": {
            "name": "bottle",
            "centre": "lagos",
            "country": "kenya"
        },
        "witnesses": [
            {
                "userId": "2nd",
                "email": "person2@gmail.com",
                "username": "person2",
                "imageUrl": "person2.jpeg",
                "witnessLocation": {"name": "new", "centre": "Nairobi", "country": "Kenya"}
            },
            {
                "userId": "3rd",
                "email": "person3@gmail.com",
                "username": "person3",
                "imageUrl": "person3.jpeg",
                "witnessLocation": {"name": "Another", "centre": "Nairobi", "country": "Kenya"}
            }
            ]
      }
    }
```

## GET categories
Allows a user to get all categories

### Sample request
`curl --request GET`

#### url
`/api/categories`

### Sample response
```
{
    "data": {
        "categories": [
            {
                "id": 97,
                "name": "Frequent office absence without authorization",
                "visible": true,
                "createdAt": "2018-11-28T12:50:49.190Z",
                "updatedAt": "2018-11-28T12:50:49.190Z",
                "levelId": 1
            },
            {
                "id": 98,
                "name": "Use of abusive language",
                "visible": true,
                "createdAt": "2018-11-28T12:50:49.190Z",
                "updatedAt": "2018-11-28T12:50:49.190Z",
                "levelId": 1
            },
        ],
        "status": "success"
    }
}
```

## GET Category incidents
Allows a user to get incidents by category

### Sample request
`curl --request GET`

#### url
`/api/categories/<categoryId>incidents`

### Sample response
```
{
    "data": {
        "incidents": [
            {
                "id": "cjfkubrlv0001tsjksuis3",
                "description": "Someone said something that was discriminative to my gender",
                "subject": "Discrimination",
                "dateOccurred": "2018-02-03T00:00:00.000Z",
                "categoryId": 115,
                "createdAt": "2018-11-28T12:53:02.827Z",
                "updatedAt": "2018-11-28T12:53:02.827Z",
                "statusId": 3,
                "locationId": "cjee241h20000g7xsfzd572sl",
                "levelId": 3,
                "Level": {
                    "name": "Green"
                },
                "Status": {
                    "status": "Resolved"
                },
                "Location": {
                    "name": "Cafeteria",
                    "centre": "Nairobi",
                    "country": "Kenya"
                },
                "assignees": [],
                "reporter": [
                    {
                        "id": "cjl6efcka00004tny9ilz7b61",
                        "slackId": "U7LEPG8LF",
                        "email": "batian.muthoga@andela.com",
                        "username": "Batian Muthoga",
                        "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
                        "createdAt": "2018-11-28T12:46:58.123Z",
                        "updatedAt": "2018-11-28T12:46:58.123Z",
                        "locationId": "cjee24xnn0000i2xsh9qauyn5",
                        "roleId": 2
                    }
                ],
                "witnesses": []
            }
        ]
    },
    "status": "success"
}
```

## POST chat

Allows a user to post a chat.

### Sample request
`curl --request POST`

#### url
`/api/incidents/<incidentId>/chats`

#### payload
```
{
    "userEmail": "batian.muthoga@andela.com",
    "chat": "chat1"
}
```

### Sample response
```
{
  "data": {
      "id": "cjfjgiroz0001lexs5h8kx4d5",
      "chat": "New note",
      "createdAt": "2018-04-03T09:24:19.763Z",
      "updatedAt": "2018-04-03T09:24:19.763Z",
      "incidentId": "cjfcbhngw00013dxsfm2nufln",
      "userEmail": "batian.muthoga@andela.com",
      "User": {
          "id": "U7LEPG8LF",
          "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
          "username": "Batian Muthoga"
      }
  }
}
```

## GET chats

To get all existing chats to an incident

### Sample request
`curl --request GET`

#### url
`/api/incidents/<incidentId>/chats`

### Sample response
```
{
    "data": {
        "chats": [
            {
                "id": "cjfjgiroz0001lexs5h8kx4d5",
                "chat": "New note",
                "createdAt": "2018-04-03T09:24:19.763Z",
                "updatedAt": "2018-04-03T09:24:19.763Z",
                "incidentId": "cjfcbhngw00013dxsfm2nufln",
                "userEmail": "batian.muthoga@andela.com",
                "User": {
                    "id": "U7LEPG8LF",
                    "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
                    "username": "Batian Muthoga"
                }
            }
        ]
    },
    "status": "success"
}
```

## GET one  chat

To get one chat on a specific incident.

### Sample request
`curl --request GET`

#### url
`/api/chats/<chatId>`

### Sample response
```
{
    "data": {
        "id": "cjfjgiroz0001lexs5h8kx4d5",
        "chat": "New note",
        "createdAt": "2018-04-03T09:24:19.763Z",
        "updatedAt": "2018-04-03T09:24:19.763Z",
        "incidentId": "cjfcbhngw00013dxsfm2nufln",
        "userEmail": "batian.muthoga@andela.com",
        "User": {
            "id": "U7LEPG8LF",
            "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
            "username": "Batian Muthoga"
        }
  }
}
```

## PUT chat

Allows a user to edit a chat using the chat id.

### Sample request
`curl --request PUT`

#### url
`/api/chats/<chatId>`

#### payload
```
{
    "userEmail": "batian.muthoga@andela.com",
    "chat": "edited chat1"
}
```

### Sample response
```
{
  "data": {
    "id": "cjfjgiroz0001lexs5h8kx4d5",
    "chat": "New note",
    "createdAt": "2018-04-03T09:24:19.763Z",
    "updatedAt": "2018-04-03T09:24:19.763Z",
    "incidentId": "cjfcbhngw00013dxsfm2nufln",
    "userEmail": "batian.muthoga@andela.com",
    "User": {
        "id": "U7LEPG8LF",
        "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
        "username": "Batian Muthoga"
    }
  }
}
```

## DELETE chat

Allows a user to delete a chat posted using the chat id.

### Sample request
`curl --request DELETE`

#### url
`/api/chats/<chatId>`

## POST note

Allows a user to post a note on an incident.

### Sample request
`curl --request POST`

#### url
`/api/incidents/<incidentId>/notes`

#### payload
```
{
    "userEmail": "batian.muthoga@andela.com",
    "note": "This is a sample note"
}
```

### Sample response
```
{
    "data": {
        "id": "cjfcblwwx00023dxsr13zj408",
        "note": "New note",
        "createdAt": "2018-03-29T09:32:25.185Z",
        "updatedAt": "2018-03-29T09:32:25.185Z",
        "incidentId": "cjfcbhngw00013dxsfm2nufln",
        "userEmail": "batian.muthoga@andela.com",
        "User": {
            "id": "U7LEPG8LF",
            "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
            "username": "Batian Muthoga"
        }
    },
    "status": "success"
}
```

## GET notes

To get all existing notes to an incident
`curl --request GET`

#### url
`/api/incidents/<incidentId>/notes`

### Sample response
```
{
    "data": {
        "notes": [
            {
                "id": "cjfcblwwx00023dxsr13zj408",
                "note": "New note",
                "createdAt": "2018-03-29T09:32:25.185Z",
                "updatedAt": "2018-03-29T09:32:25.185Z",
                "incidentId": "cjfcbhngw00013dxsfm2nufln",
                "userEmail": "batian.muthoga@andela.com",
                "User": {
                    "id": "U7LEPG8LF",
                    "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
                    "username": "Batian Muthoga"
                }
            }
        ]
    },
    "status": "success"
}
```

## GET one  note

To get a specific note to an existing incident
### Sample request
`curl --request GET`

#### url
`/api/notes/<noteId>`

### Sample response
```
{
    "data": {
        "id": "cjfcblwwx00023dxsr13zj408",
        "note": "New note",
        "createdAt": "2018-03-29T09:32:25.185Z",
        "updatedAt": "2018-03-29T09:32:25.185Z",
        "incidentId": "cjfcbhngw00013dxsfm2nufln",
        "userEmail": "batian.muthoga@andela.com",
        "User": {
            "id": "U7LEPG8LF",
            "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
            "username": "Batian Muthoga"
        }
    },
    "status": "success"
}
```

## PUT note
Allows a user to edit a note using the note id.

### Sample request
`curl --request PUT`

#### url
`/api/notes/<noteId>`

#### payload
```
{
    "userEmail": "batian.muthoga@andela.com",
    "note": "edited sample note"
}
```

### Sample response
```
{
    "data": {
        "id": "cjfcblwwx00023dxsr13zj408",
        "note": "New note",
        "createdAt": "2018-03-29T09:32:25.185Z",
        "updatedAt": "2018-03-29T09:32:25.185Z",
        "incidentId": "cjfcbhngw00013dxsfm2nufln",
        "userEmail": "batian.muthoga@andela.com",
        "User": {
            "id": "U7LEPG8LF",
            "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
            "username": "Batian Muthoga"
          }
    },
    "status": "success"
}
```

## DELETE note

Allows a user to delete a note posted using the note id.

### Sample request
`curl --request DELETE`

#### url
`/api/notes/<noteId>`

# Admin endpoints

## Search Incidents

To get all existing incidents

### Sample request
`curl --request GET`

#### url
`/api/search/incidents?q=<key_word>`

### Sample response
```
{
    "data": {
        "incidents": [
            {
                "id": "cjgxo8kr400010w3kypkj24hv",
                "description": "something happened and I didnt like it at all",
                "subject": "Harrassment",
                "dateOccurred": "2017-07-12T00:00:00.000Z",
                "createdAt": "2018-05-08T12:48:49.936Z",
                "updatedAt": "2018-05-08T12:48:49.936Z",
                "categoryId": null,
                "statusId": 1,
                "locationId": "cjgxo8kqc00000w3kxjh1gf31",
                "levelId": 3,
                "Level": {
                    "name": "Green"
                },
                "Status": {
                    "status": "Pending"
                },
                "Location": {
                    "name": "bottle",
                    "centre": "lagos",
                    "country": "kenya"
                },
                "assignees": [],
                "reporter": {
                    "id": "brian",
                    "email": "brian@g.com",
                    "username": "brian",
                    "imageUrl": "brian.jpeg",
                    "createdAt": "2018-05-08T12:48:49.967Z",
                    "updatedAt": "2018-05-08T12:48:49.967Z",
                    "locationId": "cjgxo8krj00020w3k8oenlg5k",
                    "roleId": 1
                },
                "witnesses": [
                    {
                        "id": "3rd",
                        "email": "person3@g.com",
                        "username": "person3",
                        "imageUrl": "person3.jpeg",
                        "createdAt": "2018-05-08T12:48:50.039Z",
                        "updatedAt": "2018-05-08T12:48:50.039Z",
                        "locationId": "cjgxo8kte00040w3k6v96gwes",
                        "roleId": 1
                    },
                    {
                        "id": "2nd",
                        "email": "person2@g.com",
                        "username": "person2",
                        "imageUrl": "person2.jpeg",
                        "createdAt": "2018-05-08T12:48:50.027Z",
                        "updatedAt": "2018-05-08T12:48:50.027Z",
                        "locationId": "cjgxo8ksw00030w3kz0r2inkn",
                        "roleId": 1
                    }
                ]
            },
            {
                "id": "cjfkubrlv0001tgxs3mre",
                "description": "Someone said some things to me I cannot even type",
                "subject": "Abusive Language",
                "dateOccurred": "2017-12-10T00:00:00.000Z",
                "createdAt": "2018-05-08T08:19:00.958Z",
                "updatedAt": "2018-05-08T08:19:00.958Z",
                "categoryId": 2,
                "statusId": 2,
                "locationId": "cjee256gt0000ioxs69v4870x",
                "levelId": 1,
                "Level": {
                    "name": "Red"
                },
                "Status": {
                    "status": "In Progress"
                },
                "Location": {
                    "name": "Bootcamp Room",
                    "centre": "Kampala",
                    "country": "Uganda"
                },
                "assignees": [],
                "reporter": {
                    "id": "U7LHY6W4B",
                    "email": "mercy.muchai@andela.com",
                    "username": "Mercy Muchai",
                    "imageUrl": "https://secure.gravatar.com/avatar/cf493cf28e96f654602b2f71e4d655e2.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-48.png",
                    "createdAt": "2018-05-08T08:19:02.241Z",
                    "updatedAt": "2018-05-08T08:19:02.241Z",
                    "locationId": "cjee24xnn0000i2xsh9qauyn5",
                    "roleId": 2
                },
                "witnesses": [
                    {
                        "id": "U7LEPG8LF",
                        "email": "batian.muthoga@andela.com",
                        "username": "Batian Muthoga",
                        "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
                        "createdAt": "2018-05-08T08:19:02.241Z",
                        "updatedAt": "2018-05-08T08:19:02.241Z",
                        "locationId": "cjee24xnn0000i2xsh9qauyn5",
                        "roleId": 2
                    }
                ]
            },
            {
                "id": "cjfkubrlv0001tsjksuis3",
                "description": "Someone said something that was discriminative to my gender",
                "subject": "Discrimination",
                "dateOccurred": "2018-02-03T00:00:00.000Z",
                "createdAt": "2018-05-08T08:19:00.958Z",
                "updatedAt": "2018-05-08T08:19:00.958Z",
                "categoryId": 15,
                "statusId": 3,
                "locationId": "cjee241h20000g7xsfzd572sl",
                "levelId": 3,
                "Level": {
                    "name": "Green"
                },
                "Status": {
                    "status": "Resolved"
                },
                "Location": {
                    "name": "Cafeteria",
                    "centre": "Nairobi",
                    "country": "Kenya"
                },
                "assignees": [],
                "reporter": {
                    "id": "U7LEPG8LF",
                    "email": "batian.muthoga@andela.com",
                    "username": "Batian Muthoga",
                    "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
                    "createdAt": "2018-05-08T08:19:02.241Z",
                    "updatedAt": "2018-05-08T08:19:02.241Z",
                    "locationId": "cjee24xnn0000i2xsh9qauyn5",
                    "roleId": 2
                },
                "witnesses": [
                    {
                        "id": "U7LHY6W4B",
                        "email": "mercy.muchai@andela.com",
                        "username": "Mercy Muchai",
                        "imageUrl": "https://secure.gravatar.com/avatar/cf493cf28e96f654602b2f71e4d655e2.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-48.png",
                        "createdAt": "2018-05-08T08:19:02.241Z",
                        "updatedAt": "2018-05-08T08:19:02.241Z",
                        "locationId": "cjee24xnn0000i2xsh9qauyn5",
                        "roleId": 2
                    }
                ]
            }
        ]
    },
    "status": "success"
}
```

## DELETE Incident
Allows an admin to delete an incident.

### Sample request
`curl --request DELETE`

#### url
`/api/incidents/<incidentId>`

## POST user
Allows an admin to create a user

### Sample request
`curl --request POST`

#### url
`/api/users`

#### payload
```
{
	"email": "oliver.munala@andela.com",
	"username": "oliver.munala",
	"imageUrl": null,
	"location": {
		"name": "Gate",
		"centre": "Nairobi",
		"country": "Kenya"
	}
}
```

### Sample response
```
{
    "data": {
        "id": "cjp2nj8n2000158v2qxt1l1ip",
        "email": "oliver.munala@andela.com",
        "username": "oliver.munala",
        "imageUrl": null,
        "roleId": 2,
        "locationId": "cjp2nj8m5000058v26dka2262",
        "updatedAt": "2018-11-29T13:45:37.406Z",
        "createdAt": "2018-11-29T13:45:37.406Z",
        "slackId": null
    },
    "status": "success"
}
```

## GET Users
Allows an admin to get all users

### Sample request
`curl --request GET`

#### url
`/api/users`

### Sample response
```
{
    "data": {
        "users": [
            {
                "id": "cjl6efcka00004tny9ilz7b61",
                "slackId": "U7LEPG8LF",
                "email": "batian.muthoga@andela.com",
                "username": "Batian Muthoga",
                "imageUrl": "https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png",
                "createdAt": "2018-11-28T12:46:58.123Z",
                "updatedAt": "2018-11-28T12:46:58.123Z",
                "locationId": "cjee24xnn0000i2xsh9qauyn5",
                "roleId": 1,
                "Role": {
                    "name": "User",
                    "id": 1
                },
                "Location": {
                    "name": "Tsavo",
                    "centre": "Nairobi",
                    "country": "Kenya"
                }
            },
            {
                "id": "cjp2nj8n2000158v2qxt1l1ip",
                "slackId": null,
                "email": "oliver.munala@andela.com",
                "username": "oliver.munala",
                "imageUrl": null,
                "createdAt": "2018-11-29T13:45:37.406Z",
                "updatedAt": "2018-11-29T13:45:37.406Z",
                "locationId": "cjp2nj8m5000058v26dka2262",
                "roleId": 2,
                "Role": {
                    "name": "Assignee",
                    "id": 2
                },
                "Location": {
                    "name": "Gate",
                    "centre": "Nairobi",
                    "country": "Kenya"
                }
            },
            {
                "id": "cjl6ege6e000053nyv67otq7a",
                "slackId": "U7LHY6W4B",
                "email": "mercy.muchai@andela.com",
                "username": "Mercy Muchai",
                "imageUrl": "https://secure.gravatar.com/avatar/cf493cf28e96f654602b2f71e4d655e2.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-48.png",
                "createdAt": "2018-11-28T12:46:58.123Z",
                "updatedAt": "2018-11-28T12:46:58.123Z",
                "locationId": "cjee24xnn0000i2xsh9qauyn5",
                "roleId": 2,
                "Role": {
                    "name": "Assignee",
                    "id": 2
                },
                "Location": {
                    "name": "Tsavo",
                    "centre": "Nairobi",
                    "country": "Kenya"
                }
            },
            {
                "id": "cjl6egyei00005dnytqp4a06l",
                "slackId": "U7LHY6T4B",
                "email": "eugene.omar@andela.com",
                "username": "Eugene Omar",
                "imageUrl": "https://ca.slack-edge.com/T02R3LKBA-U4GHQF7BQ-89b22f3000e2-48",
                "createdAt": "2018-11-28T12:46:58.123Z",
                "updatedAt": "2018-11-28T12:46:58.123Z",
                "locationId": "cjee24xnn0000i2xsh9qauyn5",
                "roleId": 3,
                "Role": {
                    "name": "Admin",
                    "id": 3
                },
                "Location": {
                    "name": "Tsavo",
                    "centre": "Nairobi",
                    "country": "Kenya"
                }
            }
        ]
    },
    "status": "success"
}
```

## PUT user
Allows an admin to edit a user

### Sample request
`curl --request PUT`

#### url
`/api/users/<userId>`

#### payload
```
{
	"email": "oliver.munala@andela.com",
	"username": "munala.oliver",
	"imageUrl": null
}
```

### Sample response
```
{
    "data": {
        "id": "cjp2nj8n2000158v2qxt1l1ip",
        "slackId": null,
        "email": "oliver.munala@andela.com",
        "username": "munala.oliver",
        "imageUrl": null,
        "createdAt": "2018-11-29T13:45:37.406Z",
        "updatedAt": "2018-11-29T13:52:22.661Z",
        "locationId": "cjp2nj8m5000058v26dka2262",
        "roleId": 2,
        "Role": {
            "name": "Assignee",
            "id": 2
        },
        "Location": {
            "name": "Gate",
            "centre": "Nairobi",
            "country": "Kenya"
        }
    },
    "status": "success"
}
```

## GET user
Allows an admin to get a user

### Sample request
`curl --request GET`

#### url
`/api/users/<userId>`

### Sample response
```
{
    "data": {
        "id": "cjp2nj8n2000158v2qxt1l1ip",
        "slackId": null,
        "email": "oliver.munala@andela.com",
        "username": "munala.oliver",
        "imageUrl": null,
        "createdAt": "2018-11-29T13:45:37.406Z",
        "updatedAt": "2018-11-29T13:58:51.824Z",
        "locationId": "cjp2nj8m5000058v26dka2262",
        "roleId": 2,
        "Role": {
            "name": "Assignee",
            "id": 2
        },
        "Location": {
            "name": "Gate",
            "centre": "Nairobi",
            "country": "Kenya"
        }
    },
    "status": "success"
}
```

## GET users by name
Allows an admin to search users using the name

### Sample request
`curl --request GET`

#### url
`/api/users/search?q=<name>`

### Sample response
```
{
    "data": {
        "users": [
            {
                "id": "cjp2nj8n2000158v2qxt1l1ip",
                "slackId": null,
                "email": "oliver.munala@andela.com",
                "username": "munala.oliver",
                "imageUrl": null,
                "createdAt": "2018-11-29T13:45:37.406Z",
                "updatedAt": "2018-11-29T13:58:51.824Z",
                "locationId": "cjp2nj8m5000058v26dka2262",
                "roleId": 2,
                "Role": {
                    "name": "Assignee",
                    "id": 2
                },
                "Location": {
                    "name": "Gate",
                    "centre": "Nairobi",
                    "country": "Kenya"
                }
            }
        ]
    },
    "status": "success"
}
```

## POST Invite
Allows an admin to invite a user

### Sample request
`curl --request POST`

#### url
`/api/users/search`

#### payload
```
{
    "email": "oliver.munala@andela.com",
    "roleId": 3,
    "locationId": "cjee24xnn0000i2xsh9qauyn5"
}
```

### Sample response
```
{
    "data": {
        "id": "cjp2o97pd0001jfv2ndjzgdsi",
        "slackId": null,
        "email": "oliver.munala@andela.com",
        "username": "Oliver Munala",
        "imageUrl": null,
        "createdAt": "2018-11-29T14:05:49.250Z",
        "updatedAt": "2018-11-29T14:05:49.250Z",
        "locationId": "cjee24xnn0000i2xsh9qauyn5",
        "roleId": 3,
        "Role": {
            "name": "Admin",
            "id": 3
        },
        "Location": {
            "name": "Tsavo",
            "centre": "Nairobi",
            "country": "Kenya"
        }
    },
    "status": "success"
}
```

## DELETE user
Allows an admin to delete a user

### Sample request
`curl --request DELETE`

#### url
`/api/users/<userId>`

### Sample response
```
{
    "message": "User deleted Successfully"
}
```
