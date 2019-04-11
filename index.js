const csv = require('csvtojson')
const PDFDocument = require('pdfkit')
const _ = require('lodash')
const doc = new PDFDocument({ autoFirstPage: false })
const fs = require('fs')

doc.pipe(fs.createWriteStream('crachas.pdf'))

csv().fromFile('alunos.csv').then(linhas => {
	const alunos = []
	for (const linha of linhas) {
		for (const curso in linha) {
			alunos.push({ curso, nome: linha[curso] })
		}
	}
	_.chunk(alunos, 4).forEach((grupo, i) => {
		doc.addPage({ layout: 'landscape' })
		grupo.forEach((aluno, i) => {
			const x = (i == 0 || i == 2) ? 0 : doc.page.width / 2
			const y = ((i == 0 || i == 1) ? 0 : doc.page.height / 2) - 7
			doc.image(`${aluno.curso}.png`, x, y, {
				width: doc.page.width / 2,
				height: doc.page.height / 2
			})
			doc.fillColor('#5b284a')
			doc.font('fonte.ttf')
			doc.fontSize(16)
			doc.text(aluno.nome, x + doc.page.width / 4 - 121, y + doc.page.height / 4 + 8, {
				align: 'center',
				width: 251
			})
		})
	})
	doc.end()
})