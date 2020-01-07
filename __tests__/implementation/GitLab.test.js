'use strict';

const {
  projectSearch,
  projectSearchAll,
  issueSearch,
  groupSearch,
  exit,
  consoleError,
  beginsWith
} = require('../Harness');
const ERRORS = require('../../src/ERRORS');
const GitLab = require('../../src/implementation/Gitlab');

describe.only('GitLab implementation', () => {
  describe('Core', () => {
    test('will exit and print errors if no settings exists', async () => {
      // eslint-disable-next-line no-new
      new GitLab();

      expect(consoleError).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.EMPTY_URL);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will exit and print an error if no url exists', async () => {
      // eslint-disable-next-line no-new
      new GitLab(undefined, { auth: 'foo' });

      expect(consoleError).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.EMPTY_URL);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will exit and print an error if no auth token exists', async () => {
      // eslint-disable-next-line no-new
      new GitLab(`https://testweb.gitlab.jp:1234/team/fo`);

      expect(consoleError).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.MISSING_AUTH);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will print no errors if both the url and auth token are supplied', async () => {
      // eslint-disable-next-line no-new
      new GitLab('https://testweb.gitlab.jp:1234/team/foo', {
        auth: 'token_secret'
      });

      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });
  });

  describe('isImplementation', () => {
    test('passes for gitlab.com domains', () => {
      expect(
        GitLab.isImplementation(
          'https://gitlab.com/gitlab-com/support-forum/issues'
        )
      ).toBe(true);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('does not pass for non gitlab.com domains', () => {
      expect(
        GitLab.isImplementation(
          'https://gitlabs.com/gitlab-com/support-forum/issues'
        )
      ).toBe(false);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('does pass for non gitlab.com domains when GITLAB_URL is configured', () => {
      process.env.GITLAB_URL = 'gitlabs.com';

      expect(
        GitLab.isImplementation(
          'https://gitlabs.com/gitlab-com/support-forum/issues'
        )
      ).toBe(true);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);

      process.env.GITLAB_URL = '';
    });
  });

  describe('parseURL', () => {
    test('correctly breaks up input urls into the pathname and protocol + host', () => {
      expect(
        GitLab.parseURL('https://gitlab.com/gitlab-com/support-forum/issues')
      ).toStrictEqual([
        '/gitlab-com/support-forum/issues',
        'https://gitlab.com'
      ]);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });
  });

  describe('authenticate', () => {
    test('will fail if the user doesnt have access to the project', async () => {
      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      await git.authenticate();

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.AUTH_ERROR);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will return no errors and the api context if the user has access to the project', async () => {
      projectSearchAll.mockResolvedValueOnce([]);
      projectSearch.mockResolvedValueOnce([
        {
          id: 114,
          web_url: 'https://gitlab.com/gitlab-com/support-forum'
        }
      ]);

      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      const { api, projectId, groupId } = await git.authenticate();

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);

      // Data check
      expect(api).not.toBe(undefined);
      expect(projectId).not.toBe(undefined);
      expect(projectId).toBe(114);
      expect(groupId).toBe(undefined);
    });

    test('will return no errors and the api context if the user has access to the group', async () => {
      groupSearch.mockResolvedValueOnce([
        {
          id: 123,
          web_url: 'https://gitlab.com/groups/gitlab-com'
        }
      ]);

      const git = new GitLab('https://gitlab.com/groups/gitlab-com', {
        auth: 'token_secret'
      });
      const { api, projectId, groupId } = await git.authenticate();

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);

      // Data check
      expect(api).not.toBe(undefined);
      expect(projectId).toBe(undefined);
      expect(groupId).not.toBe(undefined);
      expect(groupId).toBe(123);
    });
  });

  describe('getIssues', () => {
    test('will not return any issues if the user does not have access to the project', async () => {
      projectSearchAll.mockResolvedValueOnce([]);
      projectSearch.mockResolvedValueOnce([
        {
          id: 114,
          web_url: 'https://gitlab.com/gitlab-com/support-forum'
        }
      ]);

      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      const { api } = await git.authenticate();
      await git.getIssues({ api, projectId: 9999 });

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.MISSING_ISSUES);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will not return any issues if the user does not have access to the group', async () => {
      projectSearchAll.mockResolvedValueOnce([]);
      projectSearch.mockResolvedValueOnce([
        {
          id: 114,
          web_url: 'https://gitlab.com/gitlab-com/support-forum'
        }
      ]);

      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      const { api } = await git.authenticate();
      await git.getIssues({ api, groupId: 7777 });

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.MISSING_ISSUES);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will return issues if the user has access to the project', async () => {
      const MOCK_ISSUES = [
        {
          issue: 'foo issue',
          test: 'pass'
        }
      ];
      projectSearchAll.mockResolvedValueOnce([]);
      projectSearch.mockResolvedValueOnce([
        {
          id: 114,
          web_url: 'https://gitlab.com/gitlab-com/support-forum'
        }
      ]);
      issueSearch.mockResolvedValueOnce(MOCK_ISSUES);

      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      const { api, projectId, groupId } = await git.authenticate();
      const issues = await git.getIssues({ api, projectId: 114 });

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);

      // Data check
      expect(api).not.toBe(undefined);
      expect(projectId).not.toBe(undefined);
      expect(projectId).toBe(114);
      expect(groupId).toBe(undefined);
      expect(issues).toStrictEqual(MOCK_ISSUES);
    });

    test('will return issues if the user has access to the group', async () => {
      const MOCK_ISSUES = [
        {
          issue: 'foo issue',
          test: 'pass'
        }
      ];
      groupSearch.mockResolvedValueOnce([
        {
          id: 123,
          web_url: 'https://gitlab.com/groups/gitlab-com'
        }
      ]);
      issueSearch.mockResolvedValueOnce(MOCK_ISSUES);

      const git = new GitLab('https://gitlab.com/groups/gitlab-com', {
        auth: 'token_secret'
      });
      const { api, projectId, groupId } = await git.authenticate();
      const issues = await git.getIssues({ api, groupId: 123 });

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);

      // Data check
      expect(api).not.toBe(undefined);
      expect(projectId).toBe(undefined);
      expect(groupId).not.toBe(undefined);
      expect(groupId).toBe(123);
      expect(issues).toStrictEqual(MOCK_ISSUES);
    });

    test('will return the project_name in the payload', async () => {
      const projects = [
        {
          id: 114,
          web_url: 'https://gitlab.com/gitlab-com/support-forum',
          path_with_namespace: 'foo/bar/baz'
        }
      ];
      projectSearchAll.mockReturnValue(projects);
      projectSearch.mockReturnValue(projects);
      issueSearch.mockReturnValue([
        {
          project_id: 114,
          issue: 'foo issue',
          test: 'pass'
        }
      ]);

      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      const { api, projectId, groupId } = await git.authenticate();
      const issues = await git.getIssues({ api, projectId });

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);

      // Data check
      expect(api).not.toBe(undefined);
      expect(projectId).not.toBe(undefined);
      expect(projectId).toBe(114);
      expect(groupId).toBe(undefined);
      expect(issues).toStrictEqual([
        {
          issue: 'foo issue',
          test: 'pass',
          project_id: 114,
          project_name: 'foo/bar/baz'
        }
      ]);
    });
  });

  describe('addProjectNames', () => {
    test('will fail if no api object is given', () => {
      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      git.addProjectNames();

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(
          beginsWith(`${ERRORS.INVALID_PARAMETERS} addProjectNames (api:`)
        )
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will fail if no issues array is given', () => {
      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      git.addProjectNames({});

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(
          beginsWith(`${ERRORS.INVALID_PARAMETERS} addProjectNames (issues:`)
        )
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will fail if issues param is not an array (obj)', () => {
      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      git.addProjectNames({}, {});

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(
          beginsWith(`${ERRORS.INVALID_PARAMETERS} addProjectNames (issues:`)
        )
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will fail if issues param is not an array (null)', () => {
      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      git.addProjectNames({}, null);

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(
          beginsWith(`${ERRORS.INVALID_PARAMETERS} addProjectNames (issues:`)
        )
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will fail if issues param is not an array (string)', () => {
      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      git.addProjectNames({}, '');

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(
          beginsWith(`${ERRORS.INVALID_PARAMETERS} addProjectNames (issues:`)
        )
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will fail if issues param is not an array (number)', () => {
      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      git.addProjectNames({}, 1);

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(
          beginsWith(`${ERRORS.INVALID_PARAMETERS} addProjectNames (issues:`)
        )
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will return the input issues with mapped project_names if the project exists', async () => {
      const projects = [
        {
          id: 1,
          path_with_namespace: 'test/me'
        }
      ];
      const issues = [
        {
          project_id: 1,
          issue: 'anything'
        }
      ];
      projectSearchAll.mockReturnValue(projects);

      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      const { api } = await git.authenticate();

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);

      // Data check
      expect(await git.addProjectNames(api, issues)).toStrictEqual([
        {
          project_id: 1,
          issue: 'anything',
          project_name: 'test/me'
        }
      ]);
    });

    test('will return the empty project_names if the project does not exist', async () => {
      const projects = [
        {
          id: 2,
          path_with_namespace: 'test/me'
        }
      ];
      const issues = [
        {
          project_id: 1,
          issue: 'anything'
        }
      ];
      projectSearchAll.mockReturnValue(projects);

      const git = new GitLab('https://gitlab.com/gitlab-com/support-forum', {
        auth: 'token_secret'
      });
      const { api } = await git.authenticate();

      // Error check
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);

      // Data check
      expect(await git.addProjectNames(api, issues)).toStrictEqual([
        {
          project_id: 1,
          issue: 'anything',
          project_name: ''
        }
      ]);
    });
  });
});
