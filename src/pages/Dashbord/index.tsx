import DashbordLayout from 'components/ui/DashbordLayout'
import { FC, useEffect } from 'react'
import * as C3 from 'c3' // Ispravan naziv paketa je 'c3' (mala slova)
import * as API from 'api/Api'

const Dashbord: FC = () => {
  useEffect(() => {
    ;(async () => {
      const chart = C3.generate({
        bindto: '#chart',
        data: {
          x: 'x',
          columns: [['x'], ['Sales']],
          types: {
            Sales: 'bar',
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d',
            },
          },
        },
      })

      const { data } = await API.fetchChart()
      chart.load({
        columns: [
          ['x', ...data.map((r: { date: string; sum: string }) => r.date)], //
          ['Sales', ...data.map((r: { date: string; sum: string }) => r.sum)],
        ],
      })
    })()
  }, [])

  return (
    <DashbordLayout>
      <h1 className="mb-4">Sales</h1>
      <div id="chart"></div>
    </DashbordLayout>
  )
}

export default Dashbord
