#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class ProjectDiagnostic {
	constructor() {
		this.issues = [];
		this.warnings = [];
		this.recommendations = [];
	}

	run() {
		console.log('🔍 Diagnóstico del Proyecto\n');
		
		this.checkNodeVersion();
		this.checkDependencies();
		this.checkProjectStructure();
		this.checkFileSizes();
		this.checkWatchLimits();
		this.checkPerformance();
		
		this.printReport();
	}

	checkNodeVersion() {
		try {
			const version = process.version;
			const major = parseInt(version.slice(1).split('.')[0]);
			
			if (major < 16) {
				this.issues.push(`Node.js ${version} es muy antiguo. Se recomienda Node.js 16+`);
			} else if (major >= 16) {
				console.log('✅ Node.js version:', version);
			}
		} catch (error) {
			this.issues.push('No se pudo verificar la versión de Node.js');
		}
	}

	checkDependencies() {
		try {
			const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
			const deps = Object.keys(packageJson.dependencies || {});
			const devDeps = Object.keys(packageJson.devDependencies || {});
			
			console.log(`📦 Dependencias: ${deps.length} de producción, ${devDeps.length} de desarrollo`);
			
			// Verificar dependencias críticas
			const criticalDeps = ['gulp', 'browser-sync', 'gulp-sass'];
			criticalDeps.forEach(dep => {
				if (!devDeps.includes(dep)) {
					this.warnings.push(`Dependencia crítica faltante: ${dep}`);
				}
			});
			
			// Verificar versiones de Gulp
			if (packageJson.devDependencies?.gulp) {
				const gulpVersion = packageJson.devDependencies.gulp;
				if (gulpVersion.startsWith('^4') || gulpVersion.startsWith('^5')) {
					console.log('✅ Gulp version compatible');
				} else {
					this.issues.push('Versión de Gulp incompatible. Se requiere Gulp 4+');
				}
			}
		} catch (error) {
			this.issues.push('Error al leer package.json');
		}
	}

	checkProjectStructure() {
		const requiredDirs = [
			'src/pug',
			'src/scss',
			'src/js',
			'src/assets',
			'public'
		];
		
		requiredDirs.forEach(dir => {
			if (!fs.existsSync(dir)) {
				this.issues.push(`Directorio faltante: ${dir}`);
			} else {
				const files = this.countFiles(dir);
				console.log(`📁 ${dir}: ${files} archivos`);
				
				if (files > 1000) {
					this.warnings.push(`Muchos archivos en ${dir} (${files}). Considera optimizar la estructura.`);
				}
			}
		});
	}

	countFiles(dir) {
		let count = 0;
		try {
			const items = fs.readdirSync(dir);
			items.forEach(item => {
				const itemPath = path.join(dir, item);
				const stat = fs.statSync(itemPath);
				if (stat.isDirectory()) {
					count += this.countFiles(itemPath);
				} else {
					count++;
				}
			});
		} catch (error) {
			// Ignorar errores de permisos
		}
		return count;
	}

	checkFileSizes() {
		const largeFiles = [];
		this.findLargeFiles('src', largeFiles);
		
		if (largeFiles.length > 0) {
			console.log('\n📏 Archivos grandes detectados:');
			largeFiles.forEach(file => {
				console.log(`   - ${file.path} (${file.size}KB)`);
				this.warnings.push(`Archivo grande: ${file.path} (${file.size}KB)`);
			});
		}
	}

	findLargeFiles(dir, largeFiles, maxSize = 1024) {
		try {
			const items = fs.readdirSync(dir);
			items.forEach(item => {
				const itemPath = path.join(dir, item);
				const stat = fs.statSync(itemPath);
				
				if (stat.isDirectory()) {
					this.findLargeFiles(itemPath, largeFiles, maxSize);
				} else {
					const sizeKB = stat.size / 1024;
					if (sizeKB > maxSize) {
						largeFiles.push({
							path: itemPath,
							size: Math.round(sizeKB)
						});
					}
				}
			});
		} catch (error) {
			// Ignorar errores de permisos
		}
	}

	checkWatchLimits() {
		try {
			// Verificar límites del sistema de archivos
			const result = execSync('ulimit -n', { encoding: 'utf8' });
			const limit = parseInt(result.trim());
			
			if (limit < 1024) {
				this.warnings.push(`Límite de archivos abiertos bajo (${limit}). Considera aumentar con: ulimit -n 4096`);
			} else {
				console.log(`✅ Límite de archivos abiertos: ${limit}`);
			}
		} catch (error) {
			this.warnings.push('No se pudo verificar el límite de archivos abiertos');
		}
	}

	checkPerformance() {
		// Verificar si hay archivos de cache
		if (fs.existsSync('.cache')) {
			console.log('✅ Cache detectado');
		}
		
		// Verificar configuración de Gulp
		if (fs.existsSync('gulpfile.babel.js')) {
			console.log('✅ Gulpfile configurado');
		}
		
		// Recomendaciones de rendimiento
		this.recommendations.push('Usa npm run monitor para monitorear el rendimiento');
		this.recommendations.push('Ejecuta npm run clear-cache si el watch no funciona');
		this.recommendations.push('Considera usar npm run clean para limpiar completamente');
	}

	printReport() {
		console.log('\n📊 Reporte de Diagnóstico\n');
		
		if (this.issues.length === 0 && this.warnings.length === 0) {
			console.log('✅ Proyecto en buen estado');
		}
		
		if (this.issues.length > 0) {
			console.log('❌ Problemas encontrados:');
			this.issues.forEach(issue => console.log(`   - ${issue}`));
		}
		
		if (this.warnings.length > 0) {
			console.log('\n⚠️  Advertencias:');
			this.warnings.forEach(warning => console.log(`   - ${warning}`));
		}
		
		if (this.recommendations.length > 0) {
			console.log('\n💡 Recomendaciones:');
			this.recommendations.forEach(rec => console.log(`   - ${rec}`));
		}
		
		console.log('\n🔧 Comandos útiles:');
		console.log('   npm run dev          # Desarrollo');
		console.log('   npm run monitor      # Monitorear rendimiento');
		console.log('   npm run clear-cache  # Limpiar cache');
		console.log('   npm run clean        # Limpiar todo');
	}
}

// Ejecutar diagnóstico
const diagnostic = new ProjectDiagnostic();
diagnostic.run(); 
