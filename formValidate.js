const exampleModal = document.getElementById('checkout')
exampleModal.addEventListener('show.mdb.modal', (event) => {
  // Button that triggered the modal
  const button = event.relatedTarget
  // Extract info from data-mdb-* attributes
  const recipient = button.getAttribute('data-mdb-whatever')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  const modalTitle = exampleModal.querySelector('.modal-title')
  const modalBodyInput = exampleModal.querySelector('.modal-body input')

  modalTitle.textContent = `Your order ${recipient}`
  modalBodyInput.value = recipient
})