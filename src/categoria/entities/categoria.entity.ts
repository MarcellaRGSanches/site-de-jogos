import { IsNotEmpty } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Produto } from "../../produto/entities/produto.entity";


@Entity({ name: "tb_categorias" })
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    tipo: string;


    @OneToMany(() => Produto, (produto) => produto.categoria)
    produto: Produto[];

}

