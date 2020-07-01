'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if((payload.uid == null)||(payload.uid.length == 0)){
		return {code:1,msg:"用户失去连接,请重新登录"};
	}
	const db=uniCloud.database();
	const ban=db.collection('demand');
	let res = await ban.aggregate()
	  .lookup({
	    from: 'iteration',
	    localField: 'iterationId',
	    foreignField: '_id',
	    as: 'iteration',
	  })
	  .lookup({
	    from: 'user-project-role',
	    localField: 'memberId',
	    foreignField: '_id',
	    as: 'member',
	  })
	  .match({
		  projectId:event.projectId,
		  iterationId:''
	  })
	  .end()
	
	return res
};
