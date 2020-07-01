'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if((payload.uid == null)||(payload.uid.length == 0)){
		return {code:1,msg:"用户失去连接,请重新登录"};
	}
	let res = '';
	let isLeader = '';
	const db=uniCloud.database();
	const ban=db.collection('demand');
	if(event.isLeader == null){
		const ban1=db.collection('user-project-role');
		await ban1.where({
			id:event.projectId,
			uid:payload.uid
		}).get().then(res=>{
			isLeader = res.data[0].isLeader
		})
	}else{
		isLeader = true
	}
	if(isLeader){
		res = await ban.aggregate()
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
			  iterationId:event.iterationId,
		  })
		  .end()
	}else{
		res = await ban.aggregate()
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
			  iterationId:event.iterationId,
			  member:{
				  uid:payload.uid
			  }
		  })
		  .end()
	}
	
	
	return res
};
