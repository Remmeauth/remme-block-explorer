export const tracesToTree = (arr) => {
  var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.action_ordinal] = {
      key: arrElem.action_ordinal,
      account: arrElem.act.account,
      name: arrElem.act.name,
      data: arrElem.act.data,
      creator_action_ordinal: arrElem.creator_action_ordinal,
      action_ordinal: arrElem.action_ordinal,
    };
  }

  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      if (mappedElem.creator_action_ordinal) {
        if (typeof mappedArr[mappedElem['creator_action_ordinal']]['children'] === 'undefined') {
          mappedArr[mappedElem['creator_action_ordinal']]['children'] = [];
        }
        mappedArr[mappedElem['creator_action_ordinal']]['children'].push(mappedElem);
      } else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}

export const floorFigure = (figure, decimals) => {
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
};

export const fetchBackend = async (action, id, key ) => {
  try {
    var uri = `${process.env.REACT_APP_BACKEND_URI}/api/${action}`;
        uri = id ? `${uri}/${id}` : uri;
        uri = key ? `${uri}/${key}` : uri;
    const response = await fetch(uri);
    const json = await response.json();
    return json
  } catch (e) {
    return {};
  }
}
