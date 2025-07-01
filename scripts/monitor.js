#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

class BuildMonitor {
	constructor() {
		this.startTime = null;
		this.endTime = null;
		this.fileCount = 0;
		this.errors = [];
		this.warnings = [];
	}

	start() {
		this.startTime = performance.now();
		console.log('🚀 Iniciando build...');
	}

	end() {
		this.endTime = performance.now();
		const duration = this.endTime - this.startTime;
		
		console.log('\n📊 Resumen del Build:');
		console.log(`⏱️  Duración: ${duration.toFixed(2)}ms`);
		console.log(`📁 Archivos procesados: ${this.fileCount}`);
		
		if (this.errors.length > 0) {
			console.log(`❌ Errores: ${this.errors.length}`);
			this.errors.forEach(error => console.log(`   - ${error}`));
		}
		
		if (this.warnings.length > 0) {
			console.log(`⚠️  Advertencias: ${this.warnings.length}`);
			this.warnings.forEach(warning => console.log(`   - ${warning}`));
		}
		
		if (this.errors.length === 0 && this.warnings.length === 0) {
			console.log('✅ Build completado exitosamente');
		}
	}

	addError(error) {
		this.errors.push(error);
	}

	addWarning(warning) {
		this.warnings.push(warning);
	}

	incrementFileCount() {
		this.fileCount++;
	}

	// Monitorear el tamaño de archivos
	monitorFileSize(filePath) {
		try {
			const stats = fs.statSync(filePath);
			const sizeInKB = stats.size / 1024;
			
			if (sizeInKB > 1000) {
				this.addWarning(`Archivo grande detectado: ${filePath} (${sizeInKB.toFixed(2)}KB)`);
			}
		} catch (error) {
			// Ignorar errores de archivos que no existen
		}
	}

	// Verificar la estructura del proyecto
	checkProjectStructure() {
		const requiredDirs = [
			'src/pug',
			'src/scss', 
			'src/js',
			'src/assets',
			'src/data'
		];

		requiredDirs.forEach(dir => {
			if (!fs.existsSync(dir)) {
				this.addWarning(`Directorio faltante: ${dir}`);
			}
		});
	}

	// Verificar archivos de configuración
	checkConfigFiles() {
		const configFiles = [
			'package.json',
			'gulpfile.babel.js',
			'postcss.config.js'
		];

		configFiles.forEach(file => {
			if (!fs.existsSync(file)) {
				this.addError(`Archivo de configuración faltante: ${file}`);
			}
		});
	}
}

// Exportar para uso en gulpfile
export default BuildMonitor;

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
	const monitor = new BuildMonitor();
	monitor.start();
	
	// Verificar estructura del proyecto
	monitor.checkProjectStructure();
	monitor.checkConfigFiles();
	
	// Monitorear archivos grandes
	const publicDir = 'public';
	if (fs.existsSync(publicDir)) {
		const walkDir = (dir) => {
			const files = fs.readdirSync(dir);
			files.forEach(file => {
				const filePath = path.join(dir, file);
				const stat = fs.statSync(filePath);
				
				if (stat.isDirectory()) {
					walkDir(filePath);
				} else {
					monitor.incrementFileCount();
					monitor.monitorFileSize(filePath);
				}
			});
		};
		
		walkDir(publicDir);
	}
	
	monitor.end();
} 
