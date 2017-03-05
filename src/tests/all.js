"use strict";
var Should = require("should");
var Aweber_1 = require("../api/Aweber");
var config = require("./config.json");
var id = 0;
describe("Subscriber add/find/update tests", function () {
    it("Get Accounts", function () {
        this.slow(20000);
        var aweber = new Aweber_1.Aweber(config);
        return aweber.debug(false).getAccounts().then(function (response) {
            Should(response).be.an.Array();
            Should(response.length).be.above(0);
            Should(response[0]).has.property("http_etag");
            Should(response[0]).has.property("lists_collection_link");
            Should(response[0]).has.property("self_link");
            Should(response[0]).has.property("resource_type_link");
            Should(response[0]).has.property("id");
            Should(response[0]).has.property("integrations_collection_link");
        });
    });
    it("Get Lists", function () {
        this.slow(20000);
        var aweber = new Aweber_1.Aweber(config);
        return aweber.debug(false).getLists(config.accountId).then(function (response) {
            Should(response).be.an.Array();
            Should(response.length).be.above(0);
            Should(response[0]).has.property("total_unconfirmed_subscribers");
            Should(response[0]).has.property("total_subscribers_subscribed_yesterday");
            Should(response[0]).has.property("unique_list_id");
            Should(response[0]).has.property("http_etag");
            Should(response[0]).has.property("web_form_split_tests_collection_link");
            Should(response[0]).has.property("subscribers_collection_link");
            Should(response[0]).has.property("total_subscribers_subscribed_today");
            Should(response[0]).has.property("id");
            Should(response[0]).has.property("total_subscribed_subscribers");
            Should(response[0]).has.property("total_unsubscribed_subscribers");
            Should(response[0]).has.property("campaigns_collection_link");
            Should(response[0]).has.property("custom_fields_collection_link");
            Should(response[0]).has.property("self_link");
            Should(response[0]).has.property("total_subscribers");
            Should(response[0]).has.property("resource_type_link");
            Should(response[0]).has.property("web_forms_collection_link");
            Should(response[0]).has.property("name");
        });
    });
    it("Add Subscriber", function () {
        this.slow(20000);
        var aweber = new Aweber_1.Aweber(config);
        return aweber.debug(false).addSubscriber(config.accountId, config.listId, {
            name: "Random Test",
            email: "random-test-123@gmail.com",
            ip_address: "10.20.30.40",
            ad_tracking: "example.com",
            custom_fields: {
                "Phone Number": "+44555666777",
                "First": "Random",
                "Last": "Test"
            }
        }).then(function (response) {
            Should(response).be.true();
        });
    });
    it("Find Subscriber by E-mail", function () {
        this.slow(20000);
        var aweber = new Aweber_1.Aweber(config);
        return aweber.debug(false).findSubscriberByEmail(config.accountId, "random-test-123@gmail.com").then(function (response) {
            Should(response).not.be.exactly(null);
            id = response.id;
            Should(response).has.property("id");
            Should(response).has.property("name");
            Should(response).has.property("email");
            Should(response.name).be.exactly("Random Test");
            Should(response.email).be.exactly("random-test-123@gmail.com");
        });
    });
    it("Update Subscriber", function () {
        this.slow(20000);
        var aweber = new Aweber_1.Aweber(config);
        return aweber.debug(false).updateSubscriber(config.accountId, config.listId, id, {
            name: "Random2 ChangeTest",
            email: "random2-testChange-123@gmail.com",
            ip_address: "15.25.35.45",
            ad_tracking: "exampleChange.com",
            custom_fields: {
                "Phone Number": "+44777666555",
                "First": "Random2",
                "Last": "ChangeTest"
            }
        }).then(function (response) {
            Should(response).has.property("id");
            Should(response).has.property("name");
            Should(response).has.property("email");
            Should(response.name).be.exactly("Random2 ChangeTest");
            Should(response.email).be.exactly("random2-testchange-123@gmail.com");
        });
    });
    it("Add Duplicate subscriber", function () {
        this.slow(20000);
        var aweber = new Aweber_1.Aweber(config);
        return aweber.debug(false).addSubscriber(config.accountId, config.listId, {
            name: "Random2 ChangeTest",
            email: "random2-testchange-123@gmail.com",
            ip_address: "15.25.35.45",
            ad_tracking: "exampleChange.com",
            custom_fields: {
                "Phone Number": "+44777666555",
                "First": "Random2",
                "Last": "ChangeTest"
            }
        }).then(function (response) {
            throw new Error("Duplicity not found.");
        }).catch(function (err) {
            Should(err.res).has.property("statusCode");
            Should(err.res.statusCode).be.exactly(400);
            Should(err.obj).has.property("error");
            Should(err.obj.error.status).be.exactly(400);
            Should(err.obj.error).has.property("message");
            Should(err.obj.error.message).be.exactly("email: Subscriber already subscribed.");
        });
    });
    it("Delete subscriber", function () {
        this.slow(20000);
        var aweber = new Aweber_1.Aweber(config);
        return aweber.debug(false).deleteSubscriber(config.accountId, config.listId, id).then(function (response) {
            Should(response).be.exactly(true);
        });
    });
    it("Find non-existent subscriber by E-mail", function () {
        this.slow(20000);
        var aweber = new Aweber_1.Aweber(config);
        return aweber.debug(false).findSubscriberByEmail(config.accountId, "non-existent-test-123@gmail.com").then(function (response) {
            Should(response).be.exactly(null);
        });
    });
});
