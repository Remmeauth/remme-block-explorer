import { api } from '../helpers'

let VOTERS = [];
let VOTEDBY = {};

const getVotedBy = (item) => {
  const who = item.owner
  item.producers.forEach(producer => {
    VOTEDBY[producer] = VOTEDBY[producer] ? VOTEDBY[producer].concat([who]) : [who];
  })
}

export const startVotersDaemon = async () => {
  try {
    var voters = [];
    var more = true;
    var limit = 50;
    var lower_bound = "";

    do {
      const votersInfo = await api(`POST`,`chain`, `get_table_rows`, `{ "pos":"1", "lower_bound":"${lower_bound}", "json": true, "code": "${process.env.REACT_APP_SYSTEM_ACCOUNT}", "scope": "${process.env.REACT_APP_SYSTEM_ACCOUNT}", "table": "voters", "limit": "${limit}" }`);
      if (!votersInfo.rows.length) {
        console.log('\x1b[31m%s\x1b[0m', '[VOTERS DAEMON] No voters.');
        return false;
      }

      more = votersInfo.more;
      lower_bound = votersInfo.rows.slice(-1).pop()['owner'];

      if (votersInfo.more) {
        votersInfo.rows.pop()
        voters = voters.concat(votersInfo.rows);
      } else {
        voters = voters.concat(votersInfo.rows);
      }
    } while (more);

    VOTERS = voters;
    VOTEDBY = {};
    VOTERS.forEach(getVotedBy);
    console.log('\x1b[32m%s\x1b[0m', '[VOTERS DAEMON] VOTERS LENGTH:', VOTERS.length);
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '[VOTERS DAEMON] ERROR: ', e ? e.message : e);
  }
}

export const getVoters = (id) => {
  return VOTERS;
}

export const getVoterInfo = (id) => {
  let voter = VOTERS.filter(item => {
    return item.owner === id
  });

  if (voter.length) {
    voter[0].votedBy = VOTEDBY[voter[0].owner] ? VOTEDBY[voter[0].owner] : []
  }

  return voter
}
