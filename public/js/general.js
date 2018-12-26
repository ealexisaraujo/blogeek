$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // TODO: Adicionar el service worker
  navigator.serviceWorker.register('notificaciones-sw.js')
  .then(registro => {
    console.log('service worker registrado')
    firebase.messaging().useServiceWorker(registro)
  }).catch(error => {
    console.log(`Error al registrar el service worker => ${error}`)
  })
  // TODO: Registrar credenciales
  const messaging  = firebase.messaging()
  messaging.usePublicVapiKey(
    'BNZhn4wGUBLYQZfRjgN_1IPt1CjDG7CPR1I3EArbh6AspkhJVvdn9kpeirvv5zh1FqcUPiqfcTsHnACcCSWFJGU'
  )
  // Init Firebase nuevamente
  firebase.initializeApp(varConfig);

  // TODO: Solicitar permisos para las notificaciones
  messaging.requestPermission()
  .then(() => {
    console.log("Permiso otorgado")
    return messaging.getToken()
  }).then(token => {
    const db = firebase.firestore()
    const settings = { timestampsInSnapshots: true }
    db.collection('tokens')
    .doc(token)
    .set({
      token: token
    }).catch(error => {
      console.log(`Error al insertar el token en la BD => ${error}`);
    })
  })

  // TODO: Recibir las notificaciones cuando el usuario esta foreground

  // TODO: Recibir las notificaciones cuando el usuario esta background

  // TODO: Listening real time
  const post = new Post()
  post.consultarTodosPost()
  

  // TODO: Firebase observador del cambio de estado
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $('#btnInicioSesion').text('Salir')
      if (user.photoURL) {
        $('#avatar').attr('src', user.photoURL)
      } else {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png')
      }
    } else {
      $('#btnInicioSesion').text('Iniciar Sesión') 
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }
  })

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      $('#btnInicioSesion').text('Iniciar Sesión')
      return firebase.auth().signOut().then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast(`SignOut Correcto`, 4000)
      }).catch (error => {
        Materialize.toast(`Error al realizar SignOut ${error}`, 4000)
      })
    }
    

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    firebase.auth().signOut()
    .then(() => {
      $('#avatar').attr('src', 'imagenes/usuario.png')
      Materialize.toast(`SignOut correcto`, 4000)
    })
    .catch(error => {
      Materialize.toast(`Error al realizar SignOut ${error}`, 4000)
    })
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')
    const post = new Post()
    post.consultarTodosPost()
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      const post = new Post()
      post.consultarPostxUsuario(user.email)
      $('#tituloPost').text('Mis Posts')
    } else {
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)    
    }
  })
})
