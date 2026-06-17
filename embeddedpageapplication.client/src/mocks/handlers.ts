import { http, HttpResponse } from 'msw';

const mockPreferences = {
    "meta": {
        "status": "Succeeded",
        "messages": [],
        "correlationId": "abec7a8f-3b3a-4665-8eb3-278e99041c03"
    },
    "data": [
        {
            "id": "aeadd686-44ff-4946-bb3b-8bdb742f4b5f",
            "collectionPointId": "",
            "label": "Group_Inserting_Personalized_Ads_In_App",
            "description": "<p>Insertion of personalized advertisements during navigation in the mobile application or website</p>",
            "status": "WITHDRAWN",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "ca783098-9d76-451c-9e6c-1ba9ca074879",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "f2949e6f-bde0-4e61-985b-e01497f6754b",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": false
                        }
                    ]
                },
                {
                    "id": "6e186c86-7660-476e-b5cd-8e83c0edf65c",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": false
                        }
                    ]
                },
                {
                    "id": "af1d8cc6-a071-4ce9-80fd-42dc96a0b21a",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": false
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "eed6b0b3-b040-430b-8e81-70ba7b3d6b7e",
            "collectionPointId": "",
            "label": "Group_Non_Personalized_Direct_Marketing_Communication",
            "description": "<p>Sending communications related to the user of the service and without commercial intent. Examples : Purchase confirmation, TR card top-up, etc.</p>",
            "status": "UNKNOWN",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "5f31e573-90c2-4b35-951e-e0cead4566d5",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "911b5cc4-34a1-4268-ba5c-ec4163a2572e",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "2bddb404-d913-4129-93a4-ea8e36137b3f",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "1fb63b15-7720-41b2-bf59-236c5094206c",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "658052ec-7d63-42ea-b5ea-0aa504c3913f",
            "collectionPointId": "",
            "label": "Group_Measuring_performance",
            "description": "<p>Measure the number of views and interaction with the ad displayed in the app</p>",
            "status": "ACTIVE",
            "version": 2,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "908e725a-3d6a-4a01-bbd3-dc038575c436",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "997dbef2-2573-4d6b-ada8-ea4cb6dd5dd3",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "221065e0-7a1c-4b59-b8f3-036e26dc8e44",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "0594026d-7d16-469b-9afc-f4a7dfd2f24a",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "30ccee78-f35f-488c-9e09-abdf25ef77bb",
            "collectionPointId": "",
            "label": "Group_Non_Personalized_Marketing_Catalogue",
            "description": "<p>Sending non-personalized marketing communication to promote a product or service available in the catalogue of the platform</p>",
            "status": "ACTIVE",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "831851f9-0a12-4ede-9952-4dceba0db748",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "8350b644-4d44-45a4-89e3-c776deff5a74",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "4778b7a7-96e5-4b39-8468-5a3bd76599ad",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "66cc0c12-65fe-4745-b3b2-4236ff3976b0",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "dba4338b-0d76-46dd-b645-eb56abd950a4",
            "collectionPointId": "",
            "label": "Group_Non_personalized_Marketing_Parteners",
            "description": "<p>Sending non-personalized communications to promote the products ot services of Edenred&#39;s thrid-party Parteners.</p>",
            "status": "ACTIVE",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "e8872605-d6c2-40d6-9799-89d16fa609cd",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "23e0af55-ff23-4e67-b883-b7ca10407972",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "a0ed7205-2904-4861-98ec-09461bbc496f",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "b27dd49e-a476-4091-83f9-8c8f6148ed1f",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "4361a1e7-e245-4173-b262-622f0442375f",
            "collectionPointId": "",
            "label": "Group_Personalized_Direct_Marketing_Communication",
            "description": "<p>Sending personalized communications to promote Edenred services and the general use of fthe platform, without any reference to a specific brand or product in the catalogue</p>",
            "status": "ACTIVE",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "87ff97ec-626a-4254-b4f9-80a0aaf48c60",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "34526627-94cc-4b2e-9a5e-932411a4f6bf",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "3ea68a4c-7998-4e28-9f87-b4ef2c3984eb",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "db901ecf-cce3-4b0a-88a4-5eb0c115c7d9",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "6e494707-04c8-4fe8-b998-6c94f7099e90",
            "collectionPointId": "",
            "label": "Group_Personalized_Marketing_Catalogue",
            "description": "<p>Sending personalized communications to promote the products or services of Parteners not available in the catalogue of the platform.</p>",
            "status": "ACTIVE",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "b3fb2100-c2eb-4760-b044-488fc2a04245",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "cd3b659e-a0e4-4eca-854d-0dfa6e06d483",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "a6caf862-5f65-4c77-a73b-d3104a813007",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "e2870d8c-784b-410b-a7c3-5f415755791a",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "1a2735c7-96c3-4542-a60c-c5bc35832536",
            "collectionPointId": "",
            "label": "Group_Personalized_Marketing_Partners",
            "description": "<p>Sending personalized communications to promote the products or services of Edenred&#39;s thris-party Partners.</p>",
            "status": "ACTIVE",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "6cfdd939-f5b0-4e25-8a34-20324f8b62f7",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "746635e1-a436-48fe-91f4-7dbc6cbcc9e7",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "1f906e94-043c-4499-81e3-eafe050511a4",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "a684af32-68cc-4d3d-ad0e-0d496dbece45",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "38c00ef5-5a3d-4386-b489-4678e7676c41",
            "collectionPointId": "",
            "label": "Group_Selling_Sharing_Personal_Data_With_Partener",
            "description": "<p>Consent for selling and/or sharing personal data with third party Parteners for thier own marketing purposes</p>",
            "status": "ACTIVE",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "1b831c86-9b75-48c0-b09e-2aaea47fad63",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "06eee93a-99ac-44d5-9ee0-289ee7f0bb44",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "e6193e8e-f165-4100-a5d3-a52c27c0ff01",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "804518cf-dc1a-415d-990d-7217c61cd864",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "ddf95078-6271-4b0e-8e7d-cdf5f3160596",
            "collectionPointId": "",
            "label": "Group_GPS__Location_Marketing",
            "description": "<p>Sending Merketing purposes&nbsp;</p>",
            "status": "ACTIVE",
            "version": 2,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "d984536b-0887-46aa-b7f4-21454c563599",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "72536810-4471-487a-bc73-72f8a766c305",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "a056f7a1-eb47-43ce-bb77-01abae4580d0",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "ba45d02b-d920-462c-8ae2-46f3b0ebee29",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "db25b1f1-e734-4e20-8b4b-7fcec4cc8192",
            "collectionPointId": "",
            "label": "Group_Personalized_ADS_Third_Party_Site_App",
            "description": "<p>Insertion of personalized ads while browsing third-party sites(audience extension). Example: social networks. Google</p>",
            "status": "ACTIVE",
            "version": 1,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "4781aab4-c03d-4081-bb05-392b9110594a",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "a96f7066-ffc6-4608-bf28-c2b38d96a9c0",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "3609a2da-a352-4e27-9eee-07047c8d1557",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "d69fbf98-1435-4fd5-80e9-7d6aebda85e5",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        },
        {
            "id": "c3498fd1-8a23-4a6d-971b-aafb98bc9cf6",
            "collectionPointId": "",
            "label": "Group_Cross_Referencing_Data_Between_Edenred_Partner",
            "description": "<p>Matching Edenred&#39;s databases with a Client&#39;s database in order to identify common Beneficiaries.</p>",
            "status": "ACTIVE",
            "version": 2,
            "purposeType": "STANDARD",
            "communicationPreferences": [
                {
                    "id": "050df5a9-38f8-4679-95c0-dce90fc1378c",
                    "name": "Email",
                    "type": "MAIL",
                    "options": [
                        {
                            "id": "83dbd403-0476-40fc-a668-cdbdac304533",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "16294f10-0a4a-4794-82ee-ee6b9142cb97",
                    "name": "Push notification",
                    "type": "PUSH_NOTIFICATION",
                    "options": [
                        {
                            "id": "082e557d-5c3a-4a49-962a-2c55d29d5c8f",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "9bc3b2db-3b06-4075-bd17-8573a0ab6845",
                    "name": "Social media",
                    "type": "SOCIAL_MEDIA",
                    "options": [
                        {
                            "id": "d906a2db-55dd-4349-a862-88877134d066",
                            "type": "",
                            "consented": true
                        }
                    ]
                },
                {
                    "id": "a8f4a712-a214-440f-8ff5-219389233f80",
                    "name": "In-App notification",
                    "type": "IN_APP_NOTIFICATION",
                    "options": [
                        {
                            "id": "6a7ae715-dccc-42b7-aae0-a41881961638",
                            "type": "",
                            "consented": true
                        }
                    ]
                }
            ],
            "otherPreferences": []
        }
    ]
};

export const handlers = [
  http.post('/api/consent/user-consents', () => {
    return HttpResponse.json(mockPreferences, { status: 200 });
  }),

  http.post('/api/consent/update-user-consents', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
