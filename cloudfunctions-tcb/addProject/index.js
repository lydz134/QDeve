'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if((payload.uid == null)||(payload.uid.length == 0)){
		return {code:1,msg:"用户失去连接,请重新登录"};
	}
	let project = {}
	let id = ''
	let projectCode = ''
	const db=uniCloud.database();
	const ban=db.collection('project');
	await ban.count().then(res=>{
		projectCode = res.total.toString().padStart(4,'0');
	})
	await ban.add({
	    projectName:event.projectName,
	    projectCode:projectCode
	}).then(res=>{
		id = res.id
	})
	await ban.where({
		_id: id
	}).get().then(res=>{
		project = res.data[0]
	})
	const ban1=db.collection('user-project-role');
	await ban1.add({
	    id:id,
		uid:payload.uid,
		isLeader:true,
		nickName:event.userNickName
	})
	return {code:0,data:project,msg:"创建成功"};
};
