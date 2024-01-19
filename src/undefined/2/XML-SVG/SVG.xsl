<?xml version="1.0"?>

<xsl:stylesheet version="1.0"  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes"/>
	<xsl:key name="filmKey" match="film" use="idF"/>
	<xsl:key name="actorKey" match="artysta" use="idA"/>
	<xsl:template match="/">
	<xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
		<html lang="EN">
			<head>
				
				<style>
					h1 { text-align: center }
					table.Oscars { border-collapse: collapse; border: 3px solid black; margin-left: auto; margin-right: auto; }
					tr.Oscars { background: SandyBrown; font:20px verdana } 
					th.Oscars { background: Azure; font:20px verdana; font-weight:bold }
					th { border: 1px solid black; }
					table.Grades { border: 0px; border-collapse: collapse; margin: 20px; margin-left: auto; margin-right: auto; }
					th.Grades0 { border: 0px; vertical-align: top;}
					table.Grades1 { border: 3px solid black; border-collapse: collapse; margin: 20px }
					th.Grades { font:15px; background: LightYellow }
					th.Waluta { text-align: left }
					table.Aktory { border-collapse: collapse; border: 3px solid black; margin-left: auto; margin-right: auto; }
					tr.Aktory { font: 20px; background: SandyBrown }
					.bar { fill: #555; height: 21px; transition: fill .3s ease; cursor: pointer; font-family: Helvetica, sans-serif; }
					text { fill: #555; }
					.chart:hover, .chart:focus { .bar { fill: #aaa; } }
					.chart1 { transform: rotate(180deg); .chart1:hover, .chart1:focus { .bar { fill: #aaa; } } }
					.bar:hover, .bar:focus { fill: red !important;  text { fill: red; } }
					.bar2:hover, .bar2:focus { fill: blue; }
					.bar2 { position: relative; fill: #555;   height: 21px;  transition: fill .3s ease; cursor: pointer; font-family: Helvetica, sans-serif;}
					svg2 { transform: rotate(180deg); }

					
				</style>
				
				<title>Baza Oscarów (dokument pomocniczy)</title>
			</head>
			
			<body>

				<h1>Baza oscarów (dokument pomocniczy)</h1>

				<figure>
					<figcaption>Zwyciężcy premii "Oscar"</figcaption>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="chart" width="1000" height="300"
						 aria-labelledby="title" role="img">
						
						<xsl:for-each select="//oscary/*[self::najlepszyAktorPierwszoplanowy or self::najlepszaAktorkaPierwszoplanowa]">
							<xsl:sort select="key('actorKey', .)/wiek" order="descending"/>
							<xsl:variable name="wiek">
								<xsl:value-of select="number(key('actorKey', .)/wiek)"/>
							</xsl:variable>
							<xsl:variable name="position">
								<xsl:value-of select="number(position())"/>
							</xsl:variable>
							<g class="bar">
								<title id="title">
									<xsl:value-of select="key('actorKey', .)/wiek"/>
								</title>
								<rect width="{$wiek * 10}" height="19" y="{$position * 20}"/>
								<text x="{$wiek * 10 + 5}" y="{$position * 20 + 8}" dy=".35em">
									<xsl:value-of select="key('actorKey', .)/imie"/>
									<xsl:text> </xsl:text>
									<xsl:value-of select="key('actorKey', .)/nazwisko"/>
									<xsl:text>&#xa;</xsl:text>	
								</text>
							</g>
						</xsl:for-each>
					</svg>
				</figure>
				
				
				<figure>
					<figcaption>Filmy według ocen krytyków</figcaption>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="chart1"
						height="300" width="550" aria-labelledby="title" role="img">
						<xsl:for-each select="//film">
							<xsl:sort select="sredniaOcena[@typ = 'Krytycy']" order="descending" />
							<xsl:variable name="ocena">
								<xsl:value-of select="number(sredniaOcena[@typ = 'Krytycy'])"/>
							</xsl:variable>
							<xsl:variable name="position">
								<xsl:value-of select="number(position())"/>
							</xsl:variable>
							<xsl:variable name="first">
								<xsl:value-of select="number(sredniaOcena[1][@typ = 'Krytycy'])"/>
							</xsl:variable>
							<g class="bar2">
								<title id="title">
									<xsl:value-of select="concat(tytul, ' ', '(', sredniaOcena[@typ = 'Krytycy'], ')')"/>
								</title>
								<rect height="{$ocena * 30}" y="10" x="{$position * 25}" width="24" dx=".35em"/>
							</g>	
						</xsl:for-each>
					</svg>
				</figure>
				
			<figure>
					<figcaption>Filmy według ocen krytyków</figcaption>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="chart1"
						height="300" width="550" aria-labelledby="title" role="img">
						<xsl:for-each select="//film">
							<xsl:sort select="sredniaOcena[@typ = 'Uzytkownicy']" order="descending" />
							<xsl:variable name="ocena">
								<xsl:value-of select="number(sredniaOcena[@typ = 'Uzytkownicy'])"/>
							</xsl:variable>
							<xsl:variable name="position">
								<xsl:value-of select="number(position())"/>
							</xsl:variable>
							<xsl:variable name="first">
								<xsl:value-of select="number(sredniaOcena[1][@typ = 'Uzytkownicy'])"/>
							</xsl:variable>
							<g class="bar2">
								<title id="title">
									<xsl:value-of select="concat(tytul, ' ', '(', sredniaOcena[@typ = 'Uzytkownicy'], ')')"/>
								</title>
								<rect height="{$ocena * 30}" y="10" x="{$position * 25}" width="24" dx=".35em"/>
							</g>	
						</xsl:for-each>
					</svg>
				</figure>
			
			</body>
		</html>
	</xsl:template>

		


</xsl:stylesheet>