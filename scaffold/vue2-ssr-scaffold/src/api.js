import axios from 'axios'

export function fetchItem (q) {
  return new Promise((resolve, reject) => {
    axios.get('http://rest.apizza.net/mock/824f67c5ae4d01a4e7c7b9038283f4e0/vue-ssr-fetchdata-api', {
      q
    }).then(
      data => {
        resolve(data.data)
      },
      err => {
        reject()
      }
    )
  })
}