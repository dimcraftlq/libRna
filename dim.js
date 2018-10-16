var dim;
(function (dim) {
    let utilities;
    (function (utilities) {
        /** Clase que convierte a escalas un rango de numeros a otro rango */
        class EscaleNumbers {
            constructor(values, scale = { min: 0, max: 1 }) {
                this.values = values;
                this.scale = scale;
                if (values.min > values.max) {
                    throw new Error('error: in 1 parameter, se esperaba que min sea menor que max');
                }
                if (scale.min > scale.max) {
                    throw new Error('error: in 2 parameter, se esperaba que min sea menor que max.');
                }
            }
            /**recibe como parametro un numero y retorna un numero con la escala definida en el constructor */
            scaleFrom(value) {
                if (value < this.values.min || value > this.values.max) {
                    throw new Error('error: se esperaba que value:' + value + ' este en el rango de [' + this.values.min + ',' + this.values.max + '], definidas en el constructor');
                }
                return (value - this.values.min) / (this.values.max - this.values.min) * (this.scale.max - this.scale.min) + this.scale.min;
            }
            /**recibe como parametro un valor escalado y retorna su valor normal */
            normalFrom(valueScaled) {
                if (valueScaled < this.scale.min || valueScaled > this.scale.max) {
                    throw new Error('error: se esperaba que value:' + valueScaled + ' este en el rango de [' + this.scale.min + ',' + this.scale.max + '], definidas en el constructor');
                }
                return (valueScaled - this.scale.min) * (this.values.max - this.values.min) / (this.scale.max - this.scale.min) + this.values.min;
            }
        }
        utilities.EscaleNumbers = EscaleNumbers;
    })(utilities = dim.utilities || (dim.utilities = {}));
    /** espacio de nombres para el procesamiento del lenguaje natural */
    let nlp;
    (function (nlp) {
        class CollectionLetters {
            constructor(arrLetters, scale) {
                this.scale = scale;
                if (arrLetters.indexOf(' ') >= 0) {
                    throw new Error('No se permite el caracter de "espacio" en el array de letras.');
                }
                this.letters = [' ', ...arrLetters];
                this.scaleNumber = new dim.utilities.EscaleNumbers({ min: 1, max: this.letters.length }, scale);
            }
            getValueLetter(letra) {
                let id = this.letters.indexOf(letra);
                if (id === -1) {
                    throw new Error('El caracter "' + letra + '" no se encuentra en la coleccion de letras.');
                }
                return this.scaleNumber.scaleFrom(id + 1);
            }
            getLetter(value) {
                if (value < this.scale.min || value > this.scale.max) {
                    throw new Error('Se esperaba parameter:value, entre ' + this.scale.min + ' y ' + this.scale.max);
                }
                let nLetras = this.letters.length, inc = this.getIncrement(), inc2 = inc / 2, ret = ' ';
                for (let i = 0; i < this.letters.length; i++) {
                    let letFloat = this.getValueLetter(this.letters[i]);
                    if (letFloat - inc2 < value && value < letFloat + inc2) {
                        ret = this.letters[i];
                    }
                }
                return ret;
            }
            getIncrement() {
                let tam = this.scale.max - this.scale.min;
                return tam / (this.letters.length - 1);
            }
        }
        nlp.CollectionLetters = CollectionLetters;
        class Word {
            constructor(letters, numLetters = 10) {
                this.letters = letters;
                this.numLetters = numLetters;
            }
            getValuesWord(word) {
                let arr = word.split(''), ret = [];
                for (let i = 0; i < arr.length; i++) {
                    ret.push(this.letters.getValueLetter(arr[i]));
                }
                return ret;
            }
            getValuesNormalizeWord(word) {
                if (word.length > this.numLetters) {
                    throw new Error('La palabra:"' + word + '" tiene un tamaño de: ' + word.length + ', el tamaño de la palabra debe ser menor a: ' + this.numLetters);
                }
                let arr = this.getValuesWord(word);
                let dif = this.numLetters - arr.length;
                let arr2 = new Array(dif).fill(0);
                return [...arr, ...arr2];
            }
            getWord(values) {
                let wordArr = [];
                for (let i = 0; i < values.length; i++) {
                    wordArr.push(this.letters.getLetter(values[i]));
                }
                return wordArr.join('');
            }
            getNormalizeWord(values) {
                if (values.length > this.numLetters) {
                    throw new Error('El tamaño de array requerido es de:' + this.numLetters + ' elemento');
                }
                let wordArr = [];
                for (let i = 0; i < values.length; i++) {
                    wordArr.push(this.letters.getLetter(values[i]));
                }
                return wordArr.join('');
            }
        }
        nlp.Word = Word;
    })(nlp = dim.nlp || (dim.nlp = {}));
})(dim || (dim = {}));
