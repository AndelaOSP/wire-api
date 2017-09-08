
/**
 * Get a list of all notes for an incidence
 * @param {*} incidentId 
 */
async function getNotes(incidentId) {
  const list = [
    {
      id: 1,
      note: 'This is taken care of',
      incidentId: 1,
      userId: 1,
      dateCreated: '12-12-2008',
    },
    {
      id: 2,
      note: 'Escalated to P&C',
      incidentId: 1,
      userId: 1,
      dateCreated: '12-12-2008',
    },
  ];
  return Promise.resolve(list);
}


module.exports = {
  getNotes,
};
