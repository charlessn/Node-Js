var pageId="login";
$(document).ready(function(){
	var id = $('#pageId').val();
	if(id=="main"){
		loadPage('customer');
	}

	$('body').on('keydown' , function(event) {
		if(event.which == 13){
			if(pageId=="customer"){
				addCustomer();
			}else if(pageId=="login"){
				login();
			}
		}
	});
});

function login(){
	showMsg("");
	$.ajax({
		url:"http://localhost:3000/login",
		dataType:"json",
		type:"POST",
		data:{username:$('#username').val(),password:$('#password').val()},
		success:function(data){
			if(data=="success"){
				showMsg("Logged in successfully");
				setTimeout(function(){
					navigateToPage("main");
				},1000);
			}else{
				showMsg("Invalid username or password");
			}
		},
		error:function(error){
			showMsg("Error in database connection");
		}
	});
}

function addCustomer(){
	showMsg("");
	var msg="";
	var url="";
	var data = {
		name: $('#name').val(),
		gaudian : $('#gaudian').val(),
		address : $('#address').val(),
		date_of_birth : $('#date_of_birth').val(),
		purpose : $('#purpose').val(),
		dealer : $('#dealer').val(),
		total : $('#total').val(),
		advance : $('#advance').val(),
		balance : $('#balance').val(),
		phone:$('#phone').val(),
		date:new Date().format("d/m/Y"),
		id:localStorage.getItem("customer_id")
	}
	
	if(localStorage.getItem("edit_customer")=="edit"){
		msg="Customer updated successfully";
		url="http://localhost:3000/update_customer";
	}else{
		msg="Customer added successfully";
		url="http://localhost:3000/add_customer";
	}
	
	$.ajax({
		url:url,
		dataType:"json",
		type:"POST",
		data:data,
		success:function(data){
			if(data=="success"){
				localStorage.setItem("edit_customer","add");
				showMsg(msg);
				setTimeout(function(){
					clearCustomer();
					showMsg("");
				},1000);
			}else{
			}
		},
		error:function(error){
			showMsg("Error in database connection");
		}
	});
}

function clearCustomer(){
	$('#name,#gaudian,#address,#date_of_birth,#purpose,#dealer,#total,#advance,#balance,#phone').val("")
}

function getCustomer(){
	showMsg("");
	$('#view_customer_list').html("");
	var t="",list_bg="";
	var data = {
		date:new Date().format("d/m/Y")
	}
	
	$.ajax({
		url:"http://localhost:3000/get_customer",
		dataType:"json",
		type:"POST",
		data:data,
		success:function(data){
			if(data==""){
				$('#view_customer_list').html('<div style="padding-top:20%; text-align:center;">No Records</div>');
			}else{
				showListView(data);
			}
		},
		error:function(error){
			showMsg("Error in database connection");
		}
	});
}

function showListView(data){
	var t="";
	t += '<table>'
		+'<tr style="background:#A2A3AA">'
		+'<th>Name</th>'
		+'<th>Gaudian</th>'
		+'<th>Purpose</th>'
		+'<th>Dealer</th>'
		+'<th>Total</th>'
		+'<th>Balance</th>'
		+'<th>Date</th>'
		+'<th>Mobile</th>'
		+'<th>Edit</th>'
		+'<th>Delete</th>'
		+'</tr>'
	$.each(data,function(i,row){
		 if(i%2){
			list_bg="#999FE8"
		}else{
			list_bg="#C0C3E8"
		}
		t += '<tr style="background:'+list_bg+'">'
			+'<td>'+row.name+'</td>'
			+'<td>'+row.gaudian+'</td>'
			+'<td>'+row.purpose+'</td>'
			+'<td>'+row.dealer+'</td>'
			+'<td>'+row.total+'</td>'
			+'<td>'+row.balance+'</td>'
			+'<td>'+row.date+'</td>'
			+'<td>'+row.phone_number+'</td>'
			+'<td class="list_link" onclick="editCustomer('+row.id+')">Edit</td>'
			+'<td class="list_link" onclick="deleteConfirm('+row.id+')">Delete</td>'
		+'</tr>';
	});
	$('#view_customer_list').html(t);
}

function editCustomer(id){
	localStorage.setItem("customer_id",id);
	var data = {
		id:id
	}
	loadPage('customer');
	localStorage.setItem("edit_customer","edit");
	setTimeout(function(){
		$.ajax({
			url:"http://localhost:3000/edit_customer",
			dataType:"json",
			type:"POST",
			data:data,
			success:function(data){
				var obj = data[0];
				$('#name').val(obj.name);
				$('#address').val(obj.address);
				$('#gaudian').val(obj.gaudian);
				$('#phone').val(obj.phone_number);
				$('#date_of_birth').val(obj.date_of_birth);
				$('#purpose').val(obj.purpose);
				$('#total').val(obj.total);
				$('#advance').val(obj.advance);
				$('#balance').val(obj.balance);
				$('#dealer').val(obj.dealer);
			},error:function(){
					
			}
		});
	},100);
}

function deleteConfirm(id) {
    var x;
    if (confirm("Are you sure want to delete") == true) {
        deleteCustomer(id);
	}
}

function deleteCustomer(id){
	
	var data = {
		id:id
	}
	
	$.ajax({
		url:"http://localhost:3000/delete_customer",
		dataType:"json",
		type:"POST",
		data:data,
		success:function(data){
			getCustomer();
		},error:function(){
				
		}
	});
}

function getSearchResult(){
	var searchKey = $('#search').val();
	var data = {
		key:searchKey
	}
	
	$.ajax({
		url:"http://localhost:3000/search_customer",
		dataType:"json",
		type:"POST",
		data:data,
		success:function(data){
			if(data==""){
				$('#view_customer_list').html('<div style="padding-top:20%; text-align:center;">No Records</div>');
			}else{
				showListView(data);
			}
		},error:function(){
				
		}
	});
}

function showMsg(msg){
	$('#errMsg').html(msg);
}

function logout(){
	pageId="login";
	navigateToPage('index');
}

function navigateToPage(page){
	location.href=page+".html";
}

function loadPage(page){
	$('.subTitle').removeClass('subTitle_hover');
	$('.container').html("");
	$.ajax({
		url:page+".html",
		dataType:"html",
		success:function(content){
			pageId=page;
			$('#'+page).addClass('subTitle_hover');
			$('.container').html(content);
			if(page=="view_customer"){
				getCustomer();
			}
			
			$('#search').on('keydown' , function(event) {
				if(event.which == 13){
					getSearchResult();
				}
			});
		},
		error:function(error){
		}
	});
}
