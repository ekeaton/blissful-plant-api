function makePlantsArray() {
    return [
        {
            id: 1,
            name: 'First test plant!',
            note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            num_days: 4,
            water_date: '2019-07-10'
          },
          {
            id: 2,
            name: 'Second test plant!',
            note: '',
            num_days: 5,
            water_date: '2019-06-15'
          },
          {
            id: 3,
            name: 'Third test plant!',
            note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            num_days: 10,
            water_date: '2019-06-20'
          },
          {
            id: 4,
            name: 'Fourth test plant!',
            note: '',
            num_days: 8,
            water_date: '2019-07-04'
          }
    ]
}

function makeMaliciousPlant() {
  const maliciousPlant = {
    id: 911,
    num_days: 4,
    water_date: new Date().toISOString(),
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    note: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  const expectedPlant = {
    ...maliciousPlant,
    name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    note: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousPlant,
    expectedPlant,
  }
}

module.exports = {
    makePlantsArray,
    makeMaliciousPlant
}