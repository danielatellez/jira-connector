"use strict";

module.exports = ProjectClient;

/**
 * Used to access Jira REST endpoints in '/rest/api/2/project'
 * @param {JiraClient} jiraClient
 * @constructor ProjectClient
 */
function ProjectClient(jiraClient) {
    this.jiraClient = jiraClient;

    /**
     * Returns all projects which are visible for the currently logged in user. If no user is logged in, it returns the
     * list of projects that are visible when using anonymous access.
     *
     * @method getAllProjects
     * @memberOf ProjectClient#
     * @param opts Ignored
     * @param callback Called when the projects have been retrieved.
     */
    this.getAllProjects = function (opts, callback) {
        var options = {
            uri: this.jiraClient.buildURL('/project'),
            method: 'GET',
            json: true,
            followAllRedirects: true
        };
        this.jiraClient.makeRequest(options, callback);
    };

    /**
     * Contains a full representation of a project in JSON format.
     *
     * All project keys associated with the project will only be returned if expand=projectKeys.
     *
     * @method getProject
     * @memberOf ProjectClient#
     * @param opts The request options sent to the Jira API.
     * @param opts.projectIdOrKey The project id or project key
     * @param callback Called when the project is retrieved.
     */
    this.getProject = function (opts, callback) {
        var options = this.buildRequestOptions(opts, '', 'GET');
        this.jiraClient.makeRequest(options, callback);
    };

    /**
     * Build out the request options necessary to make a particular API call.
     *
     * @private
     * @method buildRequestOptions
     * @memberOf ProjectClient#
     * @param {Object} opts The arguments passed to the method.
     * @param {number} opts.projectIdOrKey The ID of the project to use in the path.
     * @param {Array} [opts.fields] The fields to include
     * @param {Array} [opts.expand] The fields to expand
     * @param {string} path The path of the endpoint following /project/{id}
     * @param {string} method The request method.
     * @param {Object} [body] The request body, if any.
     * @param {Object} [qs] The querystring, if any.  opts.expand and opts.fields arrays will be automagically added.
     * @returns {{uri: string, method: string, body: Object, qs: Object, followAllRedirects: boolean, json: boolean}}
     */
    this.buildRequestOptions = function (opts, path, method, body, qs) {
        var basePath = '/project/' + opts.projectIdOrKey;
        if (!qs) qs = {};
        if (!body) body = {};

        if (opts.fields) {
            qs.fields = '';
            opts.fields.forEach(function (field) {
                qs.fields += field + ','
            });
            qs.fields = qs.fields.slice(0, -1);
        }

        if (opts.expand) {
            qs.expand = '';
            opts.expand.forEach(function (ex) {
                qs.expand += ex + ','
            });
            qs.expand = qs.expand.slice(0, -1);
        }

        return {
            uri: this.jiraClient.buildURL(basePath + path),
            method: method,
            body: body,
            qs: qs,
            followAllRedirects: true,
            json: true
        };
    };
}