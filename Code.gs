var COMPANY_NAME = "Socialbakers";
var COMPANY_GSUITE_DOMAIN = "socialbakers.com";

var TYPE_ALL = "all";
var TYPE_USER = "user";
var TYPE_GROUP = "group";
var TYPE_DOMAIN = "domain";
var TYPE_TRANSLATE = {
  USER: TYPE_USER,
  GROUP: TYPE_GROUP,
  CUSTOMER: TYPE_DOMAIN,
};
var STATUS_ACTIVE = "ACTIVE";
var ROLE_OWNER = "owner";
var ROLE_MANAGER = "manager";
var ROLE_MEMBER = "member";
var ROLE_TRANSLATE = {
  OWNER: ROLE_OWNER,
  MANAGER: ROLE_MANAGER,
  MEMBER: ROLE_MEMBER,
};
var WEB_ARCHIV_URL = "https://groups.google.com/a/" + COMPANY_GSUITE_DOMAIN + "/group/%s";

function doGet() {
  return HtmlService.createHtmlOutputFromFile('UI')
    .setTitle(COMPANY_NAME + ' Google Groups Directory')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function search(id, type) {
  if(type==TYPE_ALL) {
    return getAllGroupsResponse(id, type);
  }

  var email = completeEmail(id);
  var entity = searchEntity(email, type);

  if(!entity) {
    return getErrorResponse("Email address '" + email + "' doesn't exist on the domain.");
  }

  if(entity.type == TYPE_GROUP) {
    return getGroupMembersResponse(email, entity.object);
  }

  if(entity.type == TYPE_USER) {
    return getUserGroupsResponse(email, entity.object);
  }
}

function getAllGroupsResponse(id, type) {
  var groups = fetchGroups({customer:'my_customer'});
  return {
    status: true,
    type: TYPE_ALL,
    groups: groups,
  };
}

function getUserGroupsResponse(id, user) {
  var groups = fetchGroups({userKey:id});
  return {
    status: true,
    type: TYPE_USER,
    groups: groups,
    user: user,
  };
}

function fetchGroups(filter) {
  var groups = [];
  var pageToken = null;
  do {
    var result = AdminDirectory.Groups.list(filter);
    filter.pageToken = result.nextPageToken;
    if(result.groups) {
      groups = groups.concat(result.groups.map(function(group) {
        return {
          email: group.email,
          name: group.name,
          description: group.description,
          aliases: group.aliases,
        };
      }));
    }
  }
  while(result.nextPageToken);

  return groups;
}

function getGroupMembersResponse(id, group) {
  var members = fetchMembers(id);
  return {
    status: true,
    type: TYPE_GROUP,
    members: members,
    group: group,
  };
}

function fetchMembers(email) {
  var userEmail = Session.getActiveUser().getEmail();
  var members = {
    owner: [],
    manager: [],
    member: [],
  };
  var pageToken = null;
  do {
    var result = AdminDirectory.Members.list(email, {pageToken:pageToken});
    pageToken = result.nextPageToken;
    result.members.forEach(function(member){
      var role = ROLE_TRANSLATE[member.role];
      var type = TYPE_TRANSLATE[member.type];
      var email= member.email ? member.email : null;

      members[role].push({
        email: email,
        type: type,
        role: role,
        status: member.status == STATUS_ACTIVE,
        me: email == userEmail,
      });
    });
  }
  while(result.nextPageToken);
  return members;
}

function getErrorResponse(error) {
  return {
    status: false,
    type: null,
    error: error,
  }
}

function getGroupInfo(groupKey) {
  var group = AdminDirectory.Groups.get(groupKey);
  return {
    name: group.name,
    email: group.email,
    description: group.description,
    aliases: group.aliases,
    webUrl: WEB_ARCHIV_URL.replace('%s', cropUsername(group.email)),
  };
}


function getUserInfo(userKey) {
  var user = AdminDirectory.Users.get(userKey);
  return {
    name: user.name,
    email: user.primaryEmail,
    photo: user.thumbnailPhotoUrl,
    aliases: user.aliases,
    active: ! user.suspended,
  };
}


function completeEmail(shortEmail) {
  if (shortEmail.indexOf('@') == -1) {
    var currentUser = Session.getEffectiveUser().getEmail();
    var domain = currentUser.substring(currentUser.indexOf('@'));
    return shortEmail + domain;
  }
  return shortEmail;
}

function cropUsername(email) {
  return email.substring(0, email.indexOf('@'));
}

function searchEntity(id, type) {
  try {
    var entity = {
      type: type,
      object: null,
    };

    if(type==TYPE_GROUP) {
      entity.object = getGroupInfo(id);
    }
    else if(type==TYPE_USER) {
      entity.object = getUserInfo(id);
    }
    else {
      try {
        entity.object = getGroupInfo(id);
        entity.type=TYPE_GROUP;
      }
      catch(error){
        entity.object = getUserInfo(id);
        entity.type=TYPE_USER;
      }
    }
    return entity;
  }
  catch(error){
    Logger.log(error);
    return false;
  }
}

function getUrl(){
  return ScriptApp.getService().getUrl();
}
