import { useState } from 'react'
import { BamFile } from '@gmod/bam'
import { RemoteFile } from 'generic-filehandle'

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [bamUrl, setBamUrl] = useState(
    'http://localhost:4000/volvox-sorted.bam',
  )
  const [baiUrl, setBaiUrl] = useState(
    'http://localhost:4000/volvox-sorted.bam.bai',
  )
  const [result, setResult] = useState<unknown>()
  return (
    <>
      <div>This will download bam data from a http basic auth endpoint</div>
      <div>
        <label htmlFor="bam">BAM url: </label>
        <input
          id="bam"
          type="text"
          value={bamUrl}
          onChange={e => setBamUrl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="bai">BAI url: </label>
        <input
          id="bai"
          type="text"
          value={baiUrl}
          onChange={e => setBaiUrl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="user">Username: </label>
        <input
          id="user"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="pass">Password: </label>
        <input
          id="pass"
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {loading ? <div>Loading...</div> : null}
      {error ? <div style={{ color: 'red' }}>{`${error}`}</div> : null}
      {result ? (
        <div>
          Got some data here is the BAM header: {`${JSON.stringify(result)}`}
        </div>
      ) : null}
      <button
        disabled={loading}
        onClick={async () => {
          try {
            setLoading(true)
            const bam = new BamFile({
              bamFilehandle: new RemoteFile(bamUrl, {
                overrides: {
                  credentials: 'include',
                  headers: {
                    Authorization: 'Basic ' + btoa(username + ':' + password),
                  },
                },
              }),
              baiFilehandle: new RemoteFile(baiUrl, {
                overrides: {
                  credentials: 'include',
                  headers: {
                    Authorization: 'Basic ' + btoa(username + ':' + password),
                  },
                },
              }),
            })
            const result = await bam.getHeader()
            setResult(result)
          } catch (e) {
            setError(e)
          } finally {
            setLoading(false)
          }
        }}
      >
        Click to start download
      </button>
    </>
  )
}

export default App
