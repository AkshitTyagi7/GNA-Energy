export function XAxisOption({categories, brush, xmin, xmax, space, length}: {categories: string[], brush: boolean, xmin: number, xmax: number,space: number, length: number }): ApexXAxis{
    const xAxis = {
    tickAmount: 96,
    type: 'category',

    axisTicks: {
      show: true,
      borderType: 'solid',
      color: '#78909C',
      height: 3,
      offsetX: 0,
      offsetY: 0
    },

    categories: categories,

    labels: {
      style: {
        fontSize: "10px",
        colors: Colors({space: space, length: length})
      },
      hideOverlappingLabels: true,
      formatter: (value: string, timestamp: any, opts: any) => {

        if (value === '1') {
          return ['1','23-10-2022'];
        }


        if (value === '96') {
          return value;
        }
        if (parseInt(value) % 4 === 0) {
          return value;
        }

        else {
          return ['', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',  value];
        }
      },

    },
    min: brush ? 1 : xmin,
    max: brush ? null : xmax< length ? xmax : length,

  }

return xAxis as ApexXAxis;}

function Colors({space, length}: {space: number, length: number}): string[] {
    let colors: string[] = [];
    for (let i = 1; i < length + 1; i++) {

      if (i === 1 || i % space === 0 || i === 96 || i % (96 + 1) === 0) {
        colors.push('black');
      }
      else {
        colors.push('transparent');
      }
    }
    return colors;
  }