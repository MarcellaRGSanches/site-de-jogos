import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { CategoriaService } from "../../categoria/services/categoria.service";


@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService: CategoriaService
    ) { }

    async findAll(): Promise<Produto[]> {
        //SELECT * FROM tb_postagens;
        return await this.produtoRepository.find({
            relations: {
                categoria: true,
            }
        });
    }

    async findById(id: number): Promise<Produto> {
        let buscaProduto = await this.produtoRepository.findOne({
            where: { id },
            relations: {
                categoria: true,
            }

        })
        if (!buscaProduto)
            throw new HttpException('A Produto não foi encontrada', HttpStatus.NOT_FOUND);

        return buscaProduto;
    }

    async findByNome(nome: string): Promise<Produto[]> {
        return await this.produtoRepository.find({
            where: { nome: ILike(`%${nome}%`) },
            relations: {
                categoria: true,
            }
        })
    }

    async create(produto: Produto): Promise<Produto> {
        if (produto.categoria) {
            let categoria = await this.categoriaService.findById(produto.categoria.id);

            if (!categoria)
                throw new HttpException('Categoria não encontrado!', HttpStatus.NOT_FOUND);
            return await this.produtoRepository.save(produto);
        }

        return await this.produtoRepository.save(produto);
    }

    async update(produto: Produto): Promise<Produto> {

        let buscaProduto = await this.findById(produto.id);

        if (!buscaProduto || !produto.id)
            throw new HttpException('O produto não foi encontrada', HttpStatus.NOT_FOUND)
        if (produto.categoria) {
            let tema = await this.categoriaService.findById(produto.categoria.id);
            if (!tema)
                throw new HttpException('Categoria não encontrado!', HttpStatus.NOT_FOUND);

            return await this.produtoRepository.save(produto);
        }
        return await this.produtoRepository.save(produto);
    }

    async delete(id: number): Promise<DeleteResult> {
        let buscaProduto = await this.findById(id)
        if (!buscaProduto)
            throw new HttpException('O Produto não foi encontrada', HttpStatus.NOT_FOUND);

        return await this.produtoRepository.delete(id);
    }
}