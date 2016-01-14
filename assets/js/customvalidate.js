$(document).ready(function(){
$('#myForm').validate({
		rules:{


			name:{
				required: true
			},
			email: {
				required:true,
				email:true
			},
			password: {
				minlength:6,
				required:true
			}
		},
			success: function(element){
				element
				.text('OK').addClass('valid')
		}


	
	});
});