// globals
let width = 800
let height = 500
const rangeValues = {
  k: 4,
  s: 0,
  s2: 1
}

// init
function main () {
  const container = document.getElementById('chart-container')
  const contentsBounds = container.getBoundingClientRect()
  const ratio = contentsBounds.width / width
  width *= ratio
  height *= ratio

  bindInput('#k', (value) => {
    rangeValues.k = value
    draw()
  })
  bindInput('#s', (value) => {
    rangeValues.s = value
    draw()
  })
  bindInput('#s2', (value) => {
    rangeValues.s2 = value
    draw()
  })

  draw()
}

main()

// functions
function bindInput (target, cb) {
  const el = document.querySelector(target)
  const output = document.querySelector(target + '-out')
  output.textContent = el.value
  el.addEventListener('input', event => {
    const value = Number(event.target.value || 0)
    output.textContent = el.value
    cb(value)
  })
}

function derivativeLabel (x, y) {
  return `Price: ${(y / x).toFixed(2)} Y/X`
}

function renderChart (opts) {
  const { target, title, formula, derivative, points, domain } = opts

  const data = [
      {
        fn: formula,
        color: 'blue',
        skipTip: !derivative,
        derivative: derivative ? {
          fn: derivative,
          updateOnMouseMove: true
        } : undefined
      }
    ]

  let pointsColors = ['red', 'green', 'purple']
  if (points) {
  for (let i in points) {
      data.push({
        points: points[i],
        fnType: 'points',
        graphType: 'polyline',
        color: pointsColors[i]
      })
    }
  }

  return functionPlot({
    target,
    title,
    width,
    height,
    yAxis: {
      label: 'Y ($)',
      domain
    },
    xAxis: {
      label: 'X ($)',
      domain
    },
    grid: true,
    disableZoom: true,
    tip: (Array.isArray(formula) || derivative) ? {
      xLine: true,
      yLine: true,
      renderer: (x, y, i) => {
        return derivativeLabel(x, y)
      }
    } : undefined,
    data: Array.isArray(formula) ? formula : data
  })
}

function draw () {
  function r (expression, variables) {
    return expression
      .replaceAll('y', variables.y || 0)
      .replaceAll('x', variables.x || 'x')
      .replaceAll('k', variables.k || 0)
      .replaceAll('n', variables.n || 0)
      .replaceAll('s', variables.s || 0)
      .replaceAll('C', variables.C || 0)
  }

  const formulas = {
    constantSum: 'k-x',
    constantProduct: 'k/x',
    stableswap: '(1+x)^-1(k+(k^n)*(n^-n)-x)',
    chi: '(s*k+((k/n)^n)-s*x)*((s+x)^-1)'
  }

  const derivatives = {
    constantSum: '-1',
    constantProduct: '-k/x^2',
    stableswap: '(-(1+x)^-1)*(1+(k+(k^n)*(n^-n)-x)*((1+x)^-1))',
    chi: '(-(s+x)^-1)*(s+(s*k+(k^n)(n^-n)-(s*x))*((s+x)^-1))'
  }

  let charts = []
  charts[0] = renderChart({
    target: '#chart-constant-sum-1',
    title: 'x + y = C',
    formula: r(formulas.constantSum, { k: 10 }),
    domain: [0, 10]
  })
  charts[1] = renderChart({
    target: '#chart-constant-sum-2',
    title: 'x + y = C',
    formula: r(formulas.constantSum, { k: 100 }),
    derivative: r(derivatives.constantSum, { k: 10 }),
    points: [
      [
        [50, 0],
        [50, 50],
        [0, 50],
      ],
      [
        [20, 0],
        [20, 80],
        [0, 80],
      ],
      [
        [80, 0],
        [80, 20],
        [0, 20],
      ]
    ],
    domain: [0, 100]
  })
  charts[1].tip.move({x: 50, y: 50})
  charts[1].tip.show()
  charts[2] = renderChart({
    target: '#chart-constant-product-1',
    title: 'x * y = k',
    formula: r(formulas.constantProduct, { k: 4 }),
    domain: [0, 10]
  })
  charts[3] = renderChart({
    target: '#chart-constant-product-2',
    title: 'x * y = k',
    formula: r(formulas.constantProduct, { k: 4 }),
    derivative: r(derivatives.constantProduct, { k: 4}),
    domain: [0, 10]
  })
  charts[3].tip.move({x: 2, y: 2})
  charts[3].tip.show()
  charts[4] = renderChart({
    target: '#chart-stableswap-1',
    title: 'x + y + x * y = D + (D\\n)^n',
    formula: r(formulas.stableswap, { k: 4, n: 2 }),
    derivative: r(derivatives.stableswap, { k: 4, n: 2 }),
    domain: [0, 10]
  })
  charts[5] = renderChart({
    target: '#chart-chi',
    title: '𝛘(x+y+xy)=C',
    formula: r(formulas.chi, { k: 4, s: rangeValues.s, n: 2 }),
    derivative: r(derivatives.chi, { k: 4, s: rangeValues.s, n: 2 }),
    domain: [0, 10]
  })
  charts[5].tip.move({x: 2, y: 2})
  charts[5].tip.show()
  charts[6] = renderChart({
    target: '#chart-combined',
    title: 'x+y=C (green), xy=k (red), 𝛘(x+y+xy)=C (blue)',
    formula: [
      {
        fn: r(formulas.constantSum, { k: rangeValues.k }),
        color: 'green',
        derivative: {
          fn: r(derivatives.constantSum, { k: rangeValues.k }),
          updateOnMouseMove: true
        }
      },
      {
        fn: r(formulas.constantProduct, { k: rangeValues.k }),
        color: 'red',
        derivative: {
          fn: r(derivatives.constantProduct, { k: rangeValues.k }),
          updateOnMouseMove: true
        }
      },
      {
        fn: r(formulas.chi, { k: rangeValues.k, s: rangeValues.s2, n: 2 }),
        color: 'blue',
        derivative: {
          fn: r(derivatives.chi, { k: rangeValues.k, s: rangeValues.s2, n: 2 }),
          updateOnMouseMove: true
        }
      }
    ],
    domain: [0, 10]
  })
  charts[6].tip.move({x: 2, y: 2})
  charts[6].tip.show()
}
